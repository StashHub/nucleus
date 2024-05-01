import { authOptions } from "@/server/auth";
import NextAuth from "next-auth/next";
import { getCookies, setCookie } from "cookies-next";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const { remember } = req.body as { remember: string };
  const cookies = getCookies({ req, res });

  const remembered = remember === "true";
  const rememberMeCookie = cookies["next-auth.remember-me"] === "true";

  const maxAge = remembered || rememberMeCookie ? 30 * 24 * 60 * 60 : 60 * 60;

  if (remember) {
    const options = { req, res, maxAge: maxAge };
    setCookie("next-auth.remember-me", remember, options);
  }

  return (await NextAuth(req, res, {
    ...authOptions,
    session: { maxAge: maxAge },
  })) as void;
}
