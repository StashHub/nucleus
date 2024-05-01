import React, { useMemo } from "react";
import { Icons } from "./icons";
import { formatAmount } from "@/lib/utils/refundCards";
import { useQuery } from "@tanstack/react-query";
import { useLayoutContext } from "@/context";
import { getRefundEstimate } from "@/server/queries/company";
import { Prisma } from "@prisma/client";
import calculateEstimatedRefund from "@/lib/utils/refund";

function RefundCreditEstimate({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { company } = useLayoutContext();

  // Get estimate data
  const { data: companyData } = useQuery({
    queryKey: [getRefundEstimate.key, company?.id],
    queryFn: () => getRefundEstimate.mutation(company!.id),
    staleTime: Infinity,
  });

  const amount = useMemo(() => {
    let returnAmount = new Prisma.Decimal(0);

    // If there's no data then return a 0 value
    if (!companyData) return returnAmount;

    // Prisma Decimal objects lose integrity through API layer
    // It needs to be recast as a "Decimal" to check "greaterThan"
    const estimatedRefund = companyData.deal?.estimatedRefund
      ? new Prisma.Decimal(companyData.deal.estimatedRefund)
      : new Prisma.Decimal(0);

    if (estimatedRefund.greaterThan(0)) {
      returnAmount = estimatedRefund;
    } else {
      const employeeEstimate = calculateEstimatedRefund(companyData);
      returnAmount = new Prisma.Decimal(employeeEstimate);
    }

    return returnAmount;
  }, [companyData]);

  return (
    <div className={className} {...props}>
      <span className="block md:inline-block">Employee Retention Credit</span>
      {amount.d && amount.greaterThan(0) && (
        <span className="mb-2.5 ml-0 mt-2 inline-flex items-center rounded-2xl border border-info-100 bg-info-50 py-1 pl-3 pr-2.5 text-base font-medium leading-5 text-info-600 md:mb-0 md:ml-2 md:mt-0">
          <Icons.infoBadge className="mr-1 inline-block" />
          {formatAmount(amount.toNumber())}*
        </span>
      )}
    </div>
  );
}

export default RefundCreditEstimate;
