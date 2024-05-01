import type { NextApiRequest, NextApiResponse } from "next";
import {
  type ResponseError,
  type ResponseData,
  type SignUpParams,
} from "@/lib/types";
import { prisma } from "@/server/db";
import withError from "@/lib/errors";

export const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ResponseError>,
) => {
  const { method } = req;
  switch (method) {
    case "POST":
      const { email, password } = req.body as SignUpParams;

      await prisma.$transaction(async (ctx) => {
        const user = await ctx.user.create({
          data: { email: email, password: password },
        });

        await ctx.account.create({
          data: {
            userId: user.id,
            type: "credentials",
            provider: "credentials",
            providerAccountId: user.id,
          },
        });
      });

      res.status(201).json({ message: "account created" });
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withError(handler);
