import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { GitHubStrategy } from "remix-auth-github";
import { GoogleStrategy } from "remix-auth-google";

import Cache from "~/server/cache.server";
import { sessionStorage } from "~/services/session.server";
import { hashPassword, validateString } from "~/utils";

import { AuthMode, AuthProvider } from "./auth";
import DB from "./db.singleton.server";

export type User = {
  username: string;
  id: string;
};

export const errors = {
  notFound: "User not Found",
  badPassword: "Incorrect username or password",
};

export const authenticator = new Authenticator<User>(sessionStorage);
export const redirectCache = new Cache<AuthProvider, Record<string, string>>();

const url =
  process.env.NODE_ENV === "production"
    ? "https://blakenetzeband.com"
    : "http://localhost:5173";

function getCallback(provider: AuthProvider) {
  return `${url}/auth/${provider}/callback`;
}

const formStrategy = new FormStrategy(async ({ form }) => {
  const username = validateString(form.get("username"));
  const password = validateString(form.get("password"));
  const mode = validateString<AuthMode>(form.get("mode"));

  const hash = hashPassword(password);

  if (mode === "new") {
    const email = validateString(form.get("email"));
    const results = await DB.createOne<"newUser">("users", {
      username,
      password: hash,
      email,
    });
    return { username, id: results.insertedId.toString() };
  }

  const user = await DB.findOne("users", { username });

  if (!user) throw new Error(errors.notFound);

  if (hash !== user.password) {
    throw new Error(errors.badPassword);
  }

  return { username: user.username, id: user._id.toString() };
});

const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: getCallback("github"),
    scope: "user",
  },
  async ({ accessToken, extraParams, profile, ...rest }) => {
    console.log("github", { profile, accessToken, extraParams, rest });
    return { username: "", id: "" };
  }
);

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: getCallback("google"),
  },
  async ({ profile, accessToken, extraParams, ...rest }) => {
    console.log("google", { profile, accessToken, extraParams, rest });
    return { username: "", id: "" };
  }
);

authenticator
  .use(formStrategy, "form")
  .use(githubStrategy, "github")
  .use(googleStrategy, "google");
