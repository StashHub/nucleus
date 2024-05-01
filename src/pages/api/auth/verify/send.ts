import type { ResponseError, ResponseData, ResendParams } from "@/lib/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { sendOtp } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ResponseError>,
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body as ResendParams;

  if (!email) return res.status(401).end();

  const user = await prisma.user.findFirst({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).end();
  }

  // Delete any existing tokens
  const removedToken = await removeVerificationToken(user.email);

  // If there was an error removing the token
  if (!removedToken) {
    return res.status(500).json({ error: "Internal Server Error" });
  }

  // Create token and send email
  void sendOtp(user);

  return res.status(200).end();
}

// Helper function to delete the verification token
export async function removeVerificationToken(email: string) {
  try {
    const verificationToken = await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });
    return verificationToken;
  } catch (error) {
    // If any other error occurs, throw it
    throw error;
  }
}
