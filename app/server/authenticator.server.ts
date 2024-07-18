import bcrypt from "bcrypt";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { sessionStorage } from "~/services/session.server";
import { validateString } from "~/util";

import { AuthMode } from "./auth";
import DB from "./db.singleton.server";

type User = {
  username: string;
};

export const authenticator = new Authenticator<User>(sessionStorage);

// const url =
//   process.env.NODE_ENV === "production"
//     ? "https://blakenetzeband.com"
//     : "http://localhost:5173";

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = validateString(form.get("username"));
    const password = validateString(form.get("password"));
    const mode = validateString<AuthMode>(form.get("mode"));

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    if (mode === "new") {
      const email = validateString(form.get("email"));
    } else {
    }

    return { username };
  }),
  "form"
);

// export const authenticator = new Authenticator(session, {
//   sessionKey: "_session",
// });

// const getCallback = (provider: SocialsProvider) => {
//   return `${url}/auth/${provider}/callback`;
// };

// authenticator.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: getCallback(SocialsProvider.GOOGLE),
//     },
//     async ({ profile }) => {
//       console.log(profile);
//       return profile;
//     }
//   )
// );
// authenticator.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//       callbackURL: getCallback(SocialsProvider.FACEBOOK),
//     },
//     async ({ profile }) => {
//       console.log(profile);
//       return profile;
//     }
//   )
// );
