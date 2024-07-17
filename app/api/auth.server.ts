import { Authenticator } from "remix-auth";
import {
  GitHubStrategy,
  GoogleStrategy,
  SocialsProvider,
} from "remix-auth-socials";

import { session } from "~/session";

export type AvailableProvider = Extract<SocialsProvider, "google" | "github">;
export const availableProviders: AvailableProvider[] = ["github", "google"];

const url =
  process.env.NODE_ENV === "production"
    ? "https://blakenetzeband.com"
    : "http://localhost:5173";

export const authenticator = new Authenticator(session, {
  sessionKey: "_session",
});

const getCallback = (provider: SocialsProvider) => {
  return `${url}/auth/${provider}/callback`;
};

authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: getCallback(SocialsProvider.GOOGLE),
    },
    async ({ profile }) => {
      console.log(profile);
      return profile;
    }
  )
);
authenticator.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: getCallback(SocialsProvider.FACEBOOK),
    },
    async ({ profile }) => {
      console.log(profile);
      return profile;
    }
  )
);
