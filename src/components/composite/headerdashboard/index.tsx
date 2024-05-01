import { useLayoutContext } from "@/context";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import Skeleton from "@/components/ui/skeleton";

interface HeaderDashboardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

export default function HeaderDashboard({
  title,
  subtitle,
  className,
}: HeaderDashboardProps) {
  const { company } = useLayoutContext();
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-t-3xl border-none px-4 py-4 pb-6 md:px-8 md:py-6 lg:rounded-tr-none",
        className,
      )}
    >
      <div className="border-l-4 border-purple pl-4">
        <h3 className="text-xl font-medium md:text-2xl">{title}</h3>
        {subtitle && (
          <p className="mb-0 flex items-center text-neutral-600">{subtitle}</p>
        )}
      </div>
      <div className="h-inherit hidden text-right lg:block">
        <h3 className="flex items-center text-lg font-medium">
          <Icons.briefcase className="float-left mr-2" />
          {company ? (
            company.name
          ) : (
            <Skeleton className="relative top-1.5 mb-3 inline-block h-4 w-40 rounded-sm" />
          )}
        </h3>
        <div className="text-sm font-normal text-neutral-600">
          Company ID:{" "}
          {company ? (
            company.ein
          ) : (
            <Skeleton className="relative top-0.5 inline-block h-3.5 w-[4.5rem] rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
}
