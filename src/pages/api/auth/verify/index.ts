import { type ResponseError, type ResponseData } from "@/lib/types";
import { hashToken } from "@/lib/utils";
import { prisma } from "@/server/db";
import { type Prisma } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ResponseError>,
) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const { otp } = req.body as { otp: string };

    const verifiedToken = await verifyToken(otp);

    // If the code is invalid or has expired, return an error response
    if (!verifiedToken || verifiedToken.expires.valueOf() < Date.now()) {
      return res.status(404).json({
        error:
          "That code didn't match the one we sent. Check your email and try again.",
      });
    }

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error verifying otp:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Helper function to retrieve and delete the verification token
export async function verifyToken(token: string) {
  try {
    const verificationToken = await prisma.verificationToken.delete({
      where: { token: hashToken(token) },
    });

    // Update otp verification date
    await prisma.user.update({
      where: {
        email: verificationToken.identifier,
      },
      data: {
        otpVerified: new Date(Date.now()),
      },
    });

    return verificationToken;
  } catch (error) {
    // If the token is already used or deleted, return null
    // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025")
      return null;

    // If any other error occurs, throw it
    throw error;
  }
}
