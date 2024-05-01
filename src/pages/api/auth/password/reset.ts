import { type ResponseError, type ResponseData } from "@/lib/types";
import { hash, hashToken } from "@/lib/utils";
import { prisma } from "@/server/db";
import { type Prisma } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ResponseError>,
) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const { token, password } = req.body as { token: string; password: string };

    const verifiedToken = await verifyToken(token);

    // If the token is invalid or has expired, return an error response
    if (!verifiedToken || verifiedToken.expires.valueOf() < Date.now()) {
      return res.status(401).json({ error: "Invalid token" });
    }

    await prisma.user.update({
      where: { email: verifiedToken.identifier },
      data: { password: await hash(password) },
    });

    return res.status(201).json({ message: "Password updated" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Helper function to retrieve and delete the verification token
export async function verifyToken(token: string) {
  try {
    const verificationToken = await prisma.verificationToken.delete({
      where: { token: hashToken(token) },
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
