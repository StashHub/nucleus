import { type ResponseError, type ResponseData } from "@/lib/types";
import { hash } from "@/lib/utils";
import { prisma } from "@/server/db";
import { compare } from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ResponseError>,
) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const session = await getToken({ req });

    const user = await prisma.user.findFirst({
      where: { email: session!.email! },
    });

    if (!user) {
      return res.status(401).end();
    }

    const { currentpassword, password } = req.body as {
      currentpassword: string;
      password: string;
    };

    // Check if password matches
    const isValidPassword = await compare(currentpassword, user.password!);

    // If the password is invalid return an error response
    if (!isValidPassword) {
      return res.status(401).json({ error: "That password isn't right" });
    }

    // Update user password
    await prisma.user.update({
      where: { email: session!.email! },
      data: { password: await hash(password) },
    });

    return res.status(201).json({ message: "Your password was changed" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
