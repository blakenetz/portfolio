import { Session } from "@remix-run/node";

import { commitSession } from "~/services/session.server";

import { authenticator, User } from "./authenticator.server";

export async function handleUserSession(
  session: Session,
  user: User
): Promise<Headers> {
  session.set("username", user.username);
  session.set("user-id", user.id);
  session.set(authenticator.sessionKey, user.username);

  const headers = new Headers({
    "Set-Cookie": await commitSession(session),
  });

  return headers;
}
