import { useMemo } from "react";
import {
  isRefundStatusCode,
  formatAmount,
  formatDate,
} from "@/lib/utils/refundCards";
import { cn } from "@/lib/utils/cn";
import { Icons } from "./icons";
import { Event } from "@/lib/types";
import type { FormattedEvent, QuarterSummary } from "@/lib/types";

interface RenderType {
  renderType: "all" | "summary";
}

interface RefundCardsProps
  extends RenderType,
    React.HTMLAttributes<HTMLDivElement> {
  quarters: QuarterSummary[];
}

export const RefundCards = ({
  className,
  quarters,
  renderType,
  ...props
}: RefundCardsProps) => (
  <div
    className={cn("grid gap-4 md:grid-cols-2 xxl:grid-cols-3", className)}
    {...props}
  >
    {quarters?.map((q) => (
      <RefundCard quarter={q} key={q.quarter} renderType={renderType} />
    ))}
  </div>
);

interface RefundCardProps extends RenderType {
  quarter: QuarterSummary;
  events?: FormattedEvent[];
}

export const RefundCard = ({
  quarter,
  events = [],
  renderType,
}: RefundCardProps) => {
  const modifiedEvents = useMemo(() => {
    const quarterSummaryEventsFormatted = quarter.summary.events.map((e) =>
      formatEvent(e),
    );
    const res = removeDuplicates([...events, ...quarterSummaryEventsFormatted]);

    return renderType === "summary" ? res.slice(0, 1) : res;
  }, [events, quarter, renderType]);

  const mostRecentEvent = useMemo(() => modifiedEvents[0], [modifiedEvents]);

  return (
    mostRecentEvent && (
      <div className="relative flex max-h-[296px] flex-col items-center overflow-scroll rounded-2xl border-2 border-neutral-100 bg-backgroundMain p-[.125rem]">
        <div className="sticky left-0 top-0 flex w-full items-center justify-between px-4 py-2">
          <div>
            <div className="text-xs font-medium leading-[1.125rem] text-neutral-400">
              REFUND STATUS
            </div>
            <div className="text-lg font-bold sm:leading-8 md:text-xl">
              {quarter.quarter}
            </div>
          </div>
          <div
            className={cn("h-3 w-3 rounded-2xl border-2", mostRecentEvent.css)}
          ></div>
        </div>

        <div className="relative z-10 flex w-full grow flex-col justify-between rounded-2xl border border-neutral-100 bg-white px-2 py-3 sm:px-4 [&>div:last-of-type]:mb-auto [&>div:last-of-type]:pb-0 [&>div:last-of-type]:after:content-none">
          {modifiedEvents.map((event) => (
            <Event e={event} key={event.title} />
          ))}
        </div>
      </div>
    )
  );
};

interface EventProps {
  e: FormattedEvent;
}
const Event = ({ e }: EventProps) => (
  <div className="relative flex pb-4 after:absolute after:left-[22px] after:top-2 after:z-10 after:h-full after:w-[3px] after:bg-neutral-100 after:content-['']">
    <div className="flex grow">
      <div className="relative z-20 mr-2 sm:mr-4">{e.icon}</div>
      <div className="flex w-full flex-col justify-center">
        <div className="mb-[.125rem] text-sm font-medium !leading-normal sm:text-base">
          {e.title}
        </div>
        <div className="text-xs leading-[18px] text-neutral-600">
          {e.notice_date !== "" && formatDate(e.notice_date)}
        </div>
      </div>
    </div>
  </div>
);

const formatEvent = (
  e: Event,
): {
  title: string;
  css: string;
  icon: JSX.Element;
  notice_date: string;
} => {
  if (isRefundStatusCode(e.tgcode, "ISSUED")) {
    return {
      title: e.tgshort_description,
      css: "border-success-100 bg-success-300",
      icon: (
        <Icons.envelopeclosed
          fill="#CFF7D3"
          stroke2="#EAFBEB"
          stroke="#1B9827"
        />
      ),
      notice_date: e.notice_date,
    };
  }

  if (isRefundStatusCode(e.tgcode, "SENT_BACK")) {
    return {
      title: e.tgshort_description,
      css: "border-notice-100 bg-notice-300",
      icon: (
        <Icons.moreinfo fill="#FFE7CC" stroke2="#FFF3E6" stroke="#CC6D00" />
      ),
      notice_date: e.notice_date,
    };
  }

  if (isRefundStatusCode(e.tgcode, "RETURNED")) {
    return {
      title: e.tgshort_description,
      css: "border-notice-100 bg-notice-300",
      icon: (
        <Icons.moreinfo fill="#FFE7CC" stroke2="#FFF3E6" stroke="#CC6D00" />
      ),
      notice_date: e.notice_date,
    };
  }

  if (isRefundStatusCode(e.tgcode, "RECEIVED")) {
    return {
      title: e.tgshort_description,
      css: "border-info-100 bg-info-300",
      icon: (
        <Icons.eventInfo fill="#D2DDFF" stroke="#E9EEFF" stroke2="#1946CC" />
      ),
      notice_date: e.notice_date,
    };
  }

  if (isRefundStatusCode(e.tgcode, "FILED")) {
    return {
      title: e.tgshort_description,
      css: "border-info-100 bg-info-300",
      icon: <Icons.checked fill="#D2DDFF" stroke2="#E9EEFF" stroke="#1946CC" />,
      notice_date: e.notice_date,
    };
  }

  if (isRefundStatusCode(e.tgcode, "DEFAULT")) {
    return {
      title: e.tgshort_description,
      css: "border-neutral-100 bg-neutral-200",
      icon: (
        <Icons.eventClock stroke="#EFF1F5" fill="#CFD4DE" stroke2="#575C66" />
      ),
      notice_date: e.notice_date,
    };
  }

  return {
    title: "Error",
    css: "border-negative-100 bg-negative-200",
    icon: <Icons.eventInfo fill="#FCD4CF" stroke2="#C2200A" stroke="#FEEAE7" />,
    notice_date: "There was an error connecting...",
  };
};

const removeDuplicates = (array: FormattedEvent[]) => {
  return array.filter((obj, index, self) => {
    return index === self.findIndex((o) => o.title === obj.title);
  });
};
