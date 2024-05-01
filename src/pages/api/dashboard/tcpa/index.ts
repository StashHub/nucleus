import { type ResponseError, type ResponseData } from "@/lib/types";
import { prisma } from "@/server/db";
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

    const { phone, tcpa } = req.body as {
      phone: string;
      tcpa: boolean;
    };

    await prisma.phone.upsert({
      where: { userId: user.id },
      include: { user: true },
      update: {
        number: phone,
        user: {
          update: {
            where: {
              id: user.id,
            },
            data: {
              tcpaVerified: tcpa ? new Date() : null,
            },
          },
        },
      },
      create: {
        userId: user.id,
        number: phone,
      },
    });

    return res.status(201).json({ message: "TCPA verification updated" });
  } catch (error) {
    console.error("Error updating TCPA:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
