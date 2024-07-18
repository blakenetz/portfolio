import { ActionFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/server/authenticator.server";

export const action = ({ request, params }: ActionFunctionArgs) => {
  return authenticator.authenticate(params.provider!, request);
};
