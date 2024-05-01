import { prisma } from "@/server/db";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type UserCompanies } from "@/lib/types";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserCompanies>,
) {
  if (req.method !== "GET") return res.status(405).end();

  const session = await getToken({ req });

  const userCompanies = await prisma.user.findUniqueOrThrow({
    where: { email: session!.email! },
    include: {
      companies: { include: { deal: { select: { id: true, cloned: true } } } },
      phones: true,
    },
  });

  return res.status(200).json(userCompanies);
}
