import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import { authProviders } from "~/server/auth";
import { handleUserSession } from "~/server/auth.server";
import { authenticator, redirectCache } from "~/server/authenticator.server";
import { getSession } from "~/services/session.server";
import { status, validate } from "~/utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const provider = validate(params.provider, authProviders);

  const session = await getSession(request.headers.get("cookie"));
  const key = session.id || (request.headers.get("user-agent") as string);

  if (!provider) {
    return redirect(`/blog?status=${status.provider}`);
  }

  const cacheItem = await redirectCache.fetchFromCache(provider);
  const redirectUrl = decodeURIComponent(cacheItem?.[key] ?? "/blog");

  const user = await authenticator.authenticate(provider, request, {
    failureRedirect: redirectUrl + `?status=${status[provider]}`,
  });

  const headers = await handleUserSession(session, user);

  return redirect(redirectUrl + `?status=${status.authSuccess}`, { headers });
};
