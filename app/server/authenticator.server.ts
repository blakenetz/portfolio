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

export const errors = {
  notFound: "User not Found",
  badPassword: "Incorrect username or password",
};

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = validateString(form.get("username"));
    const password = validateString(form.get("password"));
    const mode = validateString<AuthMode>(form.get("mode"));

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    if (mode === "new") {
      const email = validateString(form.get("email"));
      await DB.create<"newUser">("users", {
        username,
        password: hash,
        email,
      });
      return { username };
    }

    const user = await DB.findOne("users", { username });

    if (!user) throw new Error(errors.notFound);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error(errors.badPassword);
    }

    return { username: user.username };
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