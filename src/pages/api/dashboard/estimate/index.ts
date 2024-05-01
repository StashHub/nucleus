import type { CompanyEstimate } from "@/lib/types";
import { prisma } from "@/server/db";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CompanyEstimate>,
) {
  if (req.method !== "POST") return res.status(405).end();

  const { companyId } = req.body as { companyId: string };
  if (!companyId) return res.status(401);

  // Get user selected company refund and employees
  const company = await prisma.company.findUniqueOrThrow({
    where: { id: companyId },
    select: {
      deal: { select: { estimatedRefund: true } },
      emp2020: true,
      emp2021: true,
      pt2020: true,
      pt2021: true,
    },
  });

  return res.status(200).json(company);
}
