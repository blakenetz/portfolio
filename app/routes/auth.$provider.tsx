import { ActionFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/server/authenticator.server";

export const action = ({ request, params, ...rest }: ActionFunctionArgs) => {
  console.log("provider action", params, request, rest);
  return authenticator.authenticate(params.provider!, request);
};
