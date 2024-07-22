import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { AuthorizationError } from "remix-auth";

import { AuthFetcher } from "~/server/auth";
import { authenticator } from "~/server/authenticator.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    await authenticator.authenticate(params.provider!, request, {
      throwOnError: true,
    });
    return json<AuthFetcher>({ ok: true });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return json<AuthFetcher>({ ok: false, error: error.message });
    }
    redirect("/");
  }
};
