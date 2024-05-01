import Link from "next/link";
import DashboardView from "./view";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RefundCreditEstimate from "@/components/ui/refund-credit-estimate";

const DashboardContainer = () => {
  return (
    <>
      <div className="px-4 lg:px-8">
        <div className="gradient-neutral-to-trans flex flex-col rounded-tl-lg rounded-tr-lg border border-b-0 border-neutral-100 px-4 pb-2 pt-4 md:flex-row md:items-center md:justify-between lg:px-6">
          <div>
            <h4 className="text-lg font-medium md:text-xl">
              <RefundCreditEstimate />
            </h4>
          </div>
          <div>
            <Link
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "font-normal text-primaryText",
              )}
              href="/dashboard/erc"
            >
              View your case details
            </Link>
          </div>
        </div>
      </div>
      <DashboardView />
    </>
  );
};

export default DashboardContainer;
