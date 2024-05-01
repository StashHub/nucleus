import { RefundCards } from "@/components/ui/refund-card";
import { RefundCardSkeleton } from "@/components/ui/skeletons/refund-card";
import { useLayoutContext } from "@/context";
import { Icons } from "@/components/ui/icons";
import Modal from "@/components/ui/modal";
import Link from "next/link";
import { getTaxGuardianData } from "@/server/queries/company";
import { useQuery } from "@tanstack/react-query";
import { buttonVariants } from "@/components/ui/button";
import ErrorContainer from "@/components/ui/error";
import {
  Alert,
  AlertClose,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import TCPAModalView from "./tcpa-modal";

const ctaData = [
  {
    status: "Check sent",
    helperText: "Your check for $126,000 is in the mail.",
    date: "Today",
    icon: (
      <Icons.envelopeclosed fill="#CFF7D3" stroke2="#EAFBEB" stroke="#1B9827" />
    ),
    key: 1,
  },
  {
    status: "Refund approved",
    helperText: "The IRS will send your refund check soon!",
    date: "Oct 31, 2023",
    icon: <Icons.checked fill="#D2DDFF" stroke2="#E9EEFF" stroke="#1946CC" />,
    key: 2,
  },
  {
    status: "Pending with IRS",
    helperText: "The IRS received your amended tax return.",
    date: "Oct 17, 2023",
    icon: <Icons.pending fill="#D2DDFF" stroke2="#E9EEFF" stroke="#1946CC" />,
    key: 3,
  },
  {
    status: "Sent to IRS",
    helperText: "Your tax preparer sent your amended tax return to the IRS.",
    date: "Oct 5, 2023",
    icon: (
      <Icons.paperairplane fill="#D2DDFF" stroke2="#E9EEFF" stroke="#1946CC" />
    ),
    key: 4,
  },
  {
    status: "More info required",
    helperText: "Please contact your tax preparer.",
    date: "Aug 28, 2023",
    icon: <Icons.moreinfo fill="#FFE7CC" stroke2="#FFF3E6" stroke="#CC6D00" />,
    key: 5,
  },
];

const DashboardView = () => {
  const { company } = useLayoutContext();

  const { data, isLoading, isError } = useQuery({
    queryKey: [getTaxGuardianData.key, company?.id],
    queryFn: () => getTaxGuardianData.query(company?.id),
    staleTime: 24 * 60 * 60 * 1000, // 24h
  });

  const [open, setOpen] = useState<boolean>(false);
  const cookieName = `tg-${company?.id}.monitoring`;
  useEffect(() => {
    const cookie = getCookie(cookieName);
    if (company && !!company.n8821xSigned) {
      setOpen(!cookie);
    }
  }, [setOpen, company, cookieName]);

  const handleChange = () => {
    setOpen(!open);
    setCookie(cookieName, "true");
  };

  if (isError) return <ErrorContainer />;

  return (
    <>
      <TCPAModalView />
      {open && (
        <Alert
          variant="success"
          className="relative mx-4 mb-0 mt-4 block w-auto p-4 font-medium tbl:mx-8"
          open={open}
        >
          <Icons.successCheck className="!left-4 !top-4" />
          <AlertTitle className="mb-0 pb-[1px] pr-6 text-sm font-semibold leading-[21px] text-success-900">
            You're signed up for updates with Tax Guardian!
          </AlertTitle>
          <AlertDescription className="mb-0 pr-6 text-xs text-success-800">
            Any new updates on the status of your refund will appear here.
          </AlertDescription>
          <AlertClose onClick={handleChange} />
        </Alert>
      )}
      <div className="px-4 lg:px-8">
        {isLoading ? (
          <RefundCardSkeleton count={6} className="pt-4" renderType="summary" />
        ) : (
          <>
            {data && data.signed8821 && data.quarters.length > 0 ? (
              <>
                <RefundCards
                  className="pt-4"
                  quarters={data.quarters}
                  renderType="summary"
                />
                <p className="pt-4 text-sm text-neutral-600">
                  * This is an estimate. Actual amount dependent on final
                  calculations by the IRS and any interest accrued before the
                  IRS sends the check.
                </p>
              </>
            ) : (
              <>
                <div className="mt-4 flex flex-wrap overflow-hidden rounded-lg border-2 border-info-100 bg-info-50 p-4 shadow-md md:flex-row md:p-6 md:pb-0">
                  <div className="flex w-full pb-6 md:w-1/2">
                    <div className="hidden md:block [&>svg]:min-w-[2.5rem] [&>svg]:max-w-full xl:[&>svg]:max-w-none">
                      <Icons.diagnostic />
                    </div>
                    <div className="flex w-full flex-col pl-0 pr-0 text-sm md:block md:pl-6 md:pr-10 md:text-base">
                      <h5 className="mb-2 text-xl font-semibold md:mb-6 md:text-2xl">
                        Want the latest updates from the IRS on your ERC refund?
                      </h5>
                      <p className="mb-1 border-b border-info-100 pb-2 md:mb-4 md:pb-4">
                        We're partnered with Tax Guardian to help you stay up to
                        date on the status of your refund.
                      </p>
                      <p className="mb-3 md:mb-4">Be the first to know:</p>
                      <ul className="mb-6 list-disc pl-6 [&>li::marker]:text-info-500">
                        <li className="font-medium">
                          If your refund is approved
                        </li>
                        <li className="font-medium">How much you'll receive</li>
                        <li className="font-medium">
                          When your check is in the mail
                        </li>
                      </ul>
                      <div className="inline-block">
                        {data?.url && !data.signed8821 ? (
                          <a
                            href={data.url}
                            className={buttonVariants({ variant: "default" })}
                            target="_blank"
                          >
                            Sign me up!
                          </a>
                        ) : (
                          <Modal
                            title="Send us an email to let us know!"
                            isButton
                            triggerText="Sign me up!"
                            buttonVariant={{ variant: "info" }}
                          >
                            <p className="text-sm text-neutral-600">
                              Someone from our team will get you started.
                              Signing up for updates usually takes a few
                              minutes.
                            </p>
                            <div className="flex items-center justify-start pt-2.5">
                              <div>
                                <Icons.mail2 />
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="pl-2.5">
                                  <p className="mb-0 text-sm font-medium">
                                    Email
                                  </p>
                                  <p className="mb-0 text-xs">
                                    <Link href="sales@getrefunds.com">
                                      sales@getrefunds.com
                                    </Link>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Modal>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col md:w-1/2">
                    <div
                      className={
                        "flex min-w-[540px] grow flex-col items-center rounded-2xl border-2 border-info-100 bg-backgroundMain p-[.125rem] md:min-w-full md:rounded-bl-none md:rounded-br-none md:border-b-0 md:pb-0"
                      }
                    >
                      <div className="flex w-full items-center justify-between px-4 py-2">
                        <div>
                          <div className="mb-1 text-xs font-medium text-neutral-400">
                            REFUND STATUS
                          </div>
                          <div className="font-semi-bold text-lg sm:text-2xl sm:leading-8 md:text-3xl">
                            Q2 2020
                          </div>
                        </div>
                        <div className="rounded-2xl border border-success-100 bg-success-50 px-2.5 py-[.125rem] text-sm font-medium text-success-700">
                          $126,000
                        </div>
                      </div>
                      <div className="flex h-[208px] max-h-full w-full grow flex-col justify-between overflow-scroll rounded-2xl border border-neutral-100 bg-white p-4 md:h-[310px] md:rounded-bl-none md:rounded-br-none [&>div:last-of-type]:pb-0 [&>div:last-of-type]:after:content-none">
                        {ctaData.map((q) => (
                          <div
                            key={q.key}
                            className="relative flex pb-6 after:absolute after:left-[22px] after:top-2 after:z-10 after:h-full after:w-[3px] after:bg-neutral-100 after:content-['']"
                          >
                            <div className="align-center flex grow">
                              <div className="relative z-20 mr-2 sm:mr-4">
                                {q.icon}
                              </div>
                              <div className="flex w-full flex-col justify-center">
                                <div className="mb-[.125rem] pr-28 text-sm font-medium leading-6 sm:text-base">
                                  {q.status}
                                </div>
                                <div className="text-xs text-neutral-600 sm:text-sm">
                                  {q.helperText}
                                </div>
                              </div>
                            </div>
                            <div className="absolute right-0 top-[5px] whitespace-nowrap text-xs font-medium">
                              {q.date}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="pt-4 text-sm italic">
                  * This is an estimate. Actual amount dependent on final
                  calculations by the IRS and any interest accrued before the
                  IRS sends the check.
                </p>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DashboardView;
