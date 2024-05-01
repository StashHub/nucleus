import type { NextApiRequest, NextApiResponse } from "next";
import {
  type ResponseError,
  type ResponseData,
  type SignUpConsentParams,
} from "@/lib/types";
import { prisma } from "@/server/db";
import withError from "@/lib/errors";
import { queue } from "@/lib/queues";

export const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ResponseError>,
) => {
  if (req.method !== "POST") return res.status(405).end();

  const { email, signature } = req.body as SignUpConsentParams;
  const existingUser = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (existingUser.consent) {
    return res
      .status(400)
      .json({ error: "User already consents to the terms." });
  }

  await prisma.$transaction(async (ctx) => {
    await ctx.user.update({
      where: { email: email },
      data: { consent_signature: signature, consent: new Date() },
    });
  });

  // sync redshift user-data
  await queue.add("sync", { email: email });

  res.status(201).json({ message: "consent recorded" });
};

export default withError(handler);
