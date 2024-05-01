import type { CompanyEstimate } from "../types";

// Employee count based refund calculation
const calculateEstimatedRefund = (
  companyEstimate: CompanyEstimate | undefined,
): number => {
  if (!companyEstimate) return 0;

  const { emp2020, emp2021, pt2020, pt2021 } = companyEstimate;
  return Math.floor(
    (emp2020 + pt2020 * 0.34) * 5000 + (emp2021 + pt2021 * 0.34) * 21000,
  );
};

export default calculateEstimatedRefund;
