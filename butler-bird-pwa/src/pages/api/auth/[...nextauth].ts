import NextAuth, { NextAuthOptions } from "next-auth";
import Providers from "next-auth/providers";
import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";

const options: NextAuthOptions = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect(url, baseUrl) {
      if (url) {
        return url;
      }
      return baseUrl;
    },
    session: async (session, userOrToken) => {
      if (typeof userOrToken.jwt === "string") {
        session.accessToken = userOrToken.jwt;
      }
      return session;
    },
    jwt: async (token, user, account) => {
      const isSignIn = !!user;
      if (isSignIn && account) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/${account?.provider}/callback?access_token=${account?.accessToken}`
        );
        const data = await response.json();
        token.jwt = data.jwt;
        token.id = data.user.id;
      }
      return Promise.resolve(token);
    },
  },
};

const Auth = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);

export default withSentry(Auth);
