import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefundCards } from "@/components/ui/refund-card";
import { getDocumentsCount } from "@/server/queries/company";
import { downloadDocuments } from "@/server/mutations/company";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLayoutContext } from "@/context";
import { getTaxGuardianData } from "@/server/queries/company";
import { useEffect, useState } from "react";
import ErrorContainer from "@/components/ui/error";
import { Icons } from "@/components/ui/icons";
import Skeleton from "@/components/ui/skeleton";

type ActiveTab = "activity" | "documents";

const ERCView = () => {
  const { company } = useLayoutContext();
  const [activeTab, setActiveTab] = useState<ActiveTab>("documents");

  const dealId = company?.deal?.id ?? "";
  const clonedId = company?.deal?.cloned ?? "";

  const keys = clonedId ? [dealId, clonedId] : [dealId];

  const {
    data: documentData,
    isError: documentError,
    isLoading: documentLoading,
  } = useQuery({
    queryKey: [getDocumentsCount.key, company?.id],
    queryFn: () => getDocumentsCount.query(keys),
  });

  const { mutate: zipper, isPending } = useMutation({
    mutationKey: [downloadDocuments.key],
    mutationFn: (variables: { keys: string[]; name: string }) =>
      downloadDocuments.mutation(variables.keys, variables.name),
  });

  const { data, isError } = useQuery({
    queryKey: [getTaxGuardianData.key, company?.id],
    queryFn: () => getTaxGuardianData.query(company?.id),
    enabled: company?.id ? true : false,
    staleTime: 24 * 60 * 60 * 1000, // 24h
  });

  const showActivityTab = data && data.signed8821 && data.quarters.length > 0;

  useEffect(() => {
    showActivityTab ? setActiveTab("activity") : setActiveTab("documents");
  }, [data, showActivityTab]);

  return (
    <>
      <Tabs
        value={activeTab}
        className="bg-backgroundMain"
        onValueChange={(value: string) => {
          setActiveTab(value as ActiveTab);
        }}
      >
        <TabsList>
          {showActivityTab && (
            <TabsTrigger value="activity">
              Activity{" "}
              <span className="ml-2 inline-block rounded-md border border-neutral-300 bg-neutral-100 px-1.5 text-xs font-semibold leading-[18px] text-primaryText">
                {data.quarters.length}
              </span>
            </TabsTrigger>
          )}
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        {showActivityTab && (
          <TabsContent value="activity">
            {!isError ? (
              <RefundCards quarters={data.quarters} renderType="all" />
            ) : (
              <ErrorContainer />
            )}
          </TabsContent>
        )}
        <TabsContent value="documents">
          {!documentError ? (
            <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white px-6 pb-6 pt-5 md:flex-row md:items-center">
              <div>
                {documentLoading ? (
                  <Skeleton className="mb-1 h-6 w-44" />
                ) : (
                  <p className="mb-0 text-xl font-medium">
                    {documentData?.message}
                  </p>
                )}
                <p className="mb-0 text-sm text-neutral-500">
                  These documents were collected during the processing of your
                  ERC.
                </p>
              </div>
              <div className="mt-4 md:mt-0 md:pl-4">
                <Button
                  variant="secondary"
                  disabled={isPending}
                  onClick={() => zipper({ keys: keys, name: "erc.zip" })}
                >
                  {isPending ? (
                    <>
                      Downloading...
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>Download all (.zip)</>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <ErrorContainer />
          )}
        </TabsContent>
      </Tabs>
      <p className="mt-4 px-8 text-sm font-normal text-neutral-600">
        <i>
          * This is an estimate. Actual amount dependent on final calculations
          by the IRS and any interest accrued before the IRS sends the check.
        </i>
      </p>
    </>
  );
};

export default ERCView;
