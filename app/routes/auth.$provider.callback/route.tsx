import { json, LoaderFunctionArgs } from "@remix-run/node";
import { AuthorizationError } from "remix-auth";

import { AuthFetcher } from "~/server/auth";
import { authenticator } from "~/server/authenticator.server";
import { commitSession, getSession } from "~/services/session.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  console.log("callback", params, request);

  try {
    const user = await authenticator.authenticate(params.provider!, request, {
      throwOnError: true,
    });

    const session = await getSession(request.headers.get("cookie"));
    session.set("username", user.username);
    session.set("user-id", user.id);
    session.set(authenticator.sessionKey, user.username);

    const headers = new Headers({ "Set-Cookie": await commitSession(session) });

    return json<AuthFetcher>({ ok: true }, { headers });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return json<AuthFetcher>({ ok: false, error: error.message });
    }
    console.log("error in callback", error);
    return json<AuthFetcher>({ ok: false });
  }
};
