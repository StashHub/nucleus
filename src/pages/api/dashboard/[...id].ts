import { type NextApiRequest, type NextApiResponse } from "next";
import type { CreditResponse, QuarterSummary } from "@/lib/types";
import { RedshiftService } from "@/services/redshift";
import { getQuarterSummaryQuery } from "@/server/queries/company";
import { prisma } from "@/server/db";
import { TGCODE, isAllowedTGCode, isQuarter } from "@/lib/utils/refundCards";

type QueryEvents = {
  tgcode: string;
  create_date: string;
  period_yyyymm: number;
  notice_date: string;
  tgshort_description: string;
  amount: number;
  quarter: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreditResponse>,
) {
  if (req.method !== "GET") return res.status(405).end();

  const { query } = req;
  const { id } = query as { id: string[] };
  const companyId = id[0]!;

  const company = await prisma.company.findUniqueOrThrow({
    where: { id: companyId },
    select: {
      deal: { select: { id: true, awaitingRefundDate: true } },
      guardian: true,
      covid: {
        select: {
          quarters: {
            select: { ref: true, affected: true },
            orderBy: { ref: "asc" },
          },
        },
      },
      n8821xSigned: true,
    },
  });

  const defaultEvent = {
    tgcode: "default",
    notice_date: "",
    tgshort_description: "Please check back later...",
    amount: 0,
  };

  try {
    const client = new RedshiftService();
    const results = await client.executeStatement<QueryEvents>({
      sql: getQuarterSummaryQuery,
      parameters: [{ name: "deal", value: company.deal?.id }],
    });

    const quarters = Object.values(
      results.reduce(
        (acc, row) => {
          const quarter = row.quarter;

          if (!acc[quarter]) {
            acc[quarter] = {
              quarter,
              summary: { total: 0, events: [] },
            };
          }

          if (isAllowedTGCode(row.tgcode)) {
            acc[quarter]?.summary.events.push({
              tgcode: row.tgcode,
              notice_date: row.notice_date,
              tgshort_description: row.tgshort_description,
              amount: row.amount,
            });
          }

          if (row.tgcode === TGCODE.REF_1_1.valueOf()) {
            acc[quarter]!.summary.total += row.amount;
          }
          return acc;
        },
        {} as Record<string, QuarterSummary>,
      ),
    );

    // If the quarter events are empty add the default event
    quarters.map((q) => {
      if (q.summary.events.length < 1) {
        q.summary.events.push(defaultEvent);
      }
    });

    return res.status(200).json({
      quarters,
      url: company.guardian?.url,
      signed8821: !!company.n8821xSigned,
    });
  } catch (error) {
    console.log("RedShiftService error:", error);
    // If no TaxGuardian quarters, use affected quarters instead
    const affectedQuarters = company.covid?.quarters
      ? company.covid.quarters.filter((quarter) => quarter.affected === true)
      : [];

    const affectedQuartersDefault: QuarterSummary[] = [];
    // Add default event for each affected quarter
    affectedQuarters.map((q) => {
      if (q.ref && isQuarter(q.ref)) {
        affectedQuartersDefault.push({
          quarter: q.ref,
          summary: {
            total: 0,
            events: [defaultEvent],
          },
        } as QuarterSummary);
      }
    });

    return res.status(200).json({
      quarters: affectedQuartersDefault,
      url: company.guardian?.url,
      signed8821: !!company.n8821xSigned,
    });
  }
}
