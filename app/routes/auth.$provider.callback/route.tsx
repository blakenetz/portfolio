import { LoaderFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/server/authenticator.server";

export const loader = ({ request, params }: LoaderFunctionArgs) => {
  console.log("callback", params, request);
  return authenticator.authenticate(params.provider!, request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};
