import { ActionFunctionArgs, json } from "@remix-run/node";
import { AuthorizationError } from "remix-auth";

import { AuthFetcher, authProviders } from "~/server/auth";
import { authenticator, redirectCache } from "~/server/authenticator.server";
import { commitSession, getSession } from "~/services/session.server";
import { validate } from "~/utils";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("cookie"));

  if (params.provider === "form") {
    try {
      const user = await authenticator.authenticate("form", request, {
        throwOnError: true,
      });

      session.set("username", user.username);
      session.set("user-id", user.id);

      const headers = new Headers({
        "Set-Cookie": await commitSession(session),
      });

      return json<AuthFetcher>({ ok: true }, { headers });
    } catch (error) {
      if (error instanceof AuthorizationError) {
        return json<AuthFetcher>({ ok: false, error: error.message });
      }
      return json<AuthFetcher>({ ok: false });
    }
  }

  const provider = validate(params.provider, authProviders);

  if (!provider) {
    return json<AuthFetcher>({ ok: false, error: "invalid provider" });
  }

  const key = session.id || (request.headers.get("user-agent") as string);
  const formData = await request.clone().formData();
  const redirectUrl = (formData.get("redirectUrl") as string) ?? "/blog";

  await redirectCache.storeInCache(provider, { [key]: redirectUrl });

  return await authenticator.authenticate(provider, request);
};
