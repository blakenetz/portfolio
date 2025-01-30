import { ActionFunctionArgs, json } from "@remix-run/node";
import { AuthorizationError } from "remix-auth";

import { AuthError, AuthFetcher, authProviders } from "~/server/auth";
import { handleUserSession } from "~/server/auth.server";
import { authenticator, redirectCache } from "~/server/authenticator.server";
import { getSession } from "~/services/session.server";
import { validate } from "~/utils";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("cookie"));

  if (params.provider === "form") {
    try {
      const user = await authenticator.authenticate("form", request, {
        throwOnError: true,
      });
      const headers = await handleUserSession(session, user);

      return json<AuthFetcher>({ ok: true }, { headers });
    } catch (error) {
      if (error instanceof AuthorizationError) {
        const cause = error.cause?.cause as { field?: AuthError };
        return json<AuthFetcher>({
          ok: false,
          error: error.message,
          field: cause?.field,
        });
      }
      return json<AuthFetcher>({ ok: false, status: "unknown" });
    }
  }

  const provider = validate(params.provider, authProviders);

  if (!provider) {
    return json<AuthFetcher>({ ok: false, status: "provider" });
  }

  const key = session.id || (request.headers.get("user-agent") as string);
  const formData = await request.clone().formData();
  const redirectUrl = (formData.get("redirectUrl") as string) ?? "/blog";

  await redirectCache.storeInCache(provider, { [key]: redirectUrl });

  return await authenticator.authenticate(provider, request);
};
