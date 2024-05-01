import { sha256 } from "@/lib/utils";
import { group, identify, page, track } from "@/services/segment/client";
import { useCallback } from "react";

const useTracker = () => {
  const identifyUser = useCallback(
    async ({ identifier, ...props }: { identifier: string }) => {
      try {
        return await identify({
          identifier: await sha256(identifier.toLowerCase()),
          ...props,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [],
  );

  const companyEvent = useCallback(
    async ({ groupId, ...props }: { groupId: string }) => {
      try {
        return await group({ groupId, ...props });
      } catch (error) {
        console.error(error);
      }
    },
    [],
  );

  const trackEvent = useCallback(
    async ({ label, ...props }: { label: string }) => {
      try {
        return await track({ label, ...props });
      } catch (error) {
        console.error(error);
      }
    },
    [],
  );

  const pageEvent = useCallback(
    async ({
      category,
      name,
      ...props
    }: {
      category: string;
      name: string;
    }) => {
      try {
        return await page({ category, name, ...props });
      } catch (error) {
        console.error(error);
      }
    },
    [],
  );

  return {
    identifyUser,
    companyEvent,
    trackEvent,
    pageEvent,
  };
};

export default useTracker;
