import { cn } from "@/lib/utils";
import Skeleton from "../skeleton";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  renderType: "all" | "summary";
}

export const RefundCardSkeleton = ({
  className,
  count,
  renderType,
  ...props
}: SkeletonProps) => {
  const quarterCount = Array.from(Array(count).keys());
  let eventCount = Array.from(Array(3).keys());

  // Render only one event for "summary" view
  if (renderType === "summary") {
    eventCount = eventCount.slice(0, 1);
  }

  return (
    <>
      <div
        className={cn("grid gap-4 md:grid-cols-2 xxl:grid-cols-3", className)}
      >
        {quarterCount.map((i) => (
          <div
            className="flex flex-col items-center rounded-2xl border-2 border-neutral-100 bg-backgroundMain p-[2px]"
            key={i}
            {...props}
          >
            <div className="flex w-full items-center justify-between p-4">
              <div>
                <Skeleton className="mb-2 h-2.5 w-[50px] rounded-sm" />
                <Skeleton className="h-2.5 w-[100px] rounded-sm" />
              </div>
              <Skeleton className="h-3 w-3 rounded-2xl border-2 border-neutral-100" />
            </div>
            <div className="flex w-full flex-col justify-between rounded-xl border border-neutral-100 bg-white p-4 [&>div:last-of-type]:pb-0 [&>div:last-of-type]:after:content-none">
              {eventCount.map((i) => (
                <div
                  key={i}
                  className="relative flex justify-between pb-6 after:absolute after:left-[19px] after:top-2 after:z-10 after:h-full after:w-[3px] after:bg-neutral-100 after:content-['']"
                >
                  <div className="flex max-w-[80%] grow items-center overflow-hidden pr-2">
                    <Skeleton className="relative z-20 mr-4 h-10 w-[40px] min-w-[40px] rounded-full border-[3px] border-white" />
                    <div className="w-full">
                      <Skeleton className="mb-2 h-2.5 w-full max-w-[125px] rounded-sm" />
                      <Skeleton className="h-2.5 w-full max-w-[225px] rounded-sm" />
                    </div>
                  </div>
                  <Skeleton className="mt-1.5 h-2.5 w-[50px] rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
