import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { authenticator } from "~/server/auth.server";

export const loader = () => redirect("/login");

export const action = ({ request, params }: ActionFunctionArgs) => {
  console.log("provider", params, request);
  return authenticator.authenticate(params.provider!, request);
};
