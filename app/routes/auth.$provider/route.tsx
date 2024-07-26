import { ActionFunctionArgs, json } from "@remix-run/node";
import { AuthorizationError } from "remix-auth";

import { AuthFetcher } from "~/server/auth";
import { authenticator } from "~/server/authenticator.server";
import { commitSession, getSession } from "~/services/session.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    console.log(params, params.provider);
    const user = await authenticator.authenticate(params.provider!, request, {
      throwOnError: true,
    });
    console.log("user", user);

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
    console.log("error", error);
    return json<AuthFetcher>({ ok: false });
  }
};
