import CredentialsProvider from "next-auth/providers/credentials";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";

import { compare } from "bcryptjs";
import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import type { User, Role } from "@prisma/client";
import { generateVerificationToken, hashToken } from "@/lib/utils";
import sendMail from "./mailer";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      otpVerified: Date | null;
    };
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};
        if (!email || !password) return null;

        const user = await prisma.user.findUniqueOrThrow({
          where: { email: email.trim() },
        });

        if (await compare(password, user.password!)) {
          if (!user.otpVerified) await sendOtp(user);

          return user;
        }
        return null;
      },
    }),
  ],
  debug: env.NODE_ENV === "development",
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as User;

        return {
          ...token,
          id: u.id,
          role: u.role,
          otpVerified: u.otpVerified,
        };
      }
      return token;
    },
    signIn({ user }) {
      // Check if user has valid 2FA
      const { otpVerified } = user as User;

      return !!otpVerified; // returns 403 error response
    },
  },
  events: {
    signOut: async ({ token }) => {
      await prisma.user.update({
        where: { email: token.email! },
        data: { otpVerified: null },
      });
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

export const sendOtp = async (user: User) => {
  const { token, expires } = generateVerificationToken("code");
  const otp = env.NODE_ENV === "development" ? "123456" : token;

  await prisma.$transaction(async (ctx) => {
    // Prisma does not have a findOrCreate query. You can use upsert as a workaround.
    // To make upsert behave like a findOrCreate method, provide an empty update parameter to upsert.
    await ctx.verificationToken.upsert({
      where: {
        identifier: user.email,
        token: hashToken(otp),
      },
      update: {},
      create: {
        identifier: user.email,
        token: hashToken(otp),
        expires,
      },
    });

    await sendVerificationRequest(user, otp);
  });
};

export const sendVerificationRequest = (user: User, token: string) => {
  console.log(
    `Sending verification email to ${user.email} with token: ${token}`,
  );

  const context = { code: token, name: user.name?.split(" ")[0] };
  return sendMail("Trying to sign in?", user.email, {
    template: "verification-nucleus",
    context: context,
  });
};
