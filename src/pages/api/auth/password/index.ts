import { env } from "@/env.mjs";
import { type ResponseData } from "@/lib/types";
import { generateVerificationToken, hashToken } from "@/lib/utils";
import { prisma } from "@/server/db";
import sendMail from "@/server/mailer";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") return res.status(405).end();
  const { email } = req.body as { email: string };

  // Get user name for email template context
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  // If the user doesn't exist, return a success response without further processing
  if (!existingUser) return res.status(200).end();

  // Generate a verification token and hash it
  const { token, expires } = generateVerificationToken("token");
  await prisma.verificationToken.create({
    data: { identifier: email, token: hashToken(token), expires },
  });

  // Construct the reset password URL
  const resetPasswordUrl = `${env.NEXTAUTH_URL}/password-reset/${token}`;

  // Send a reset password email to the user
  await sendMail("Reset your GetRefunds password", email, {
    template: "password-reset",
    context: {
      reset_password: resetPasswordUrl,
      name: existingUser.name ?? "",
    },
  });

  return res.status(201).json({ message: "Email sent" });
}
