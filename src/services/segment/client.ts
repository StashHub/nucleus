/*
The Segment Identify call lets you tie a user to their actions and record
traits about them. It includes a unique User ID and any optional traits you
know about the user, like their email, name, and more.

The group API call is how you associate an individual user with a group—be
it a company, organization, account, project, team or whatever other crazy
name you came up with for the same concept!

The track API call is how you record any actions your users perform, along
with any properties that describe the action.

The page call lets you record whenever a user sees a page of your website,
along with any optional properties about the page
*/
import { env } from "@/env.mjs";
import { AnalyticsBrowser } from "@segment/analytics-next";
import { getCookie } from "cookies-next";

const analytics = new AnalyticsBrowser().load({
  writeKey: env.NEXT_PUBLIC_SEGMENT_WRITE_KEY ?? "",
});

const EVENT_VERSION = "1.0";

export const group = async ({ groupId, ...props }: { groupId: string }) =>
  await analytics?.group(groupId, { ...props });

export const identify = async ({
  identifier,
  ...props
}: {
  identifier: string;
}) => await analytics?.identify(identifier, { ...props });

export const track = async ({ label, ...props }: { label: string }) =>
  await analytics?.track(
    label,
    { version: EVENT_VERSION, ...props },
    {
      // context properties SEND WITH EVERY EVENT
      amplitude_session_id: getCookie("analytics_session_id"), // THIS IS AUTOMATICALLY STORED BY AMPLITUDE IN THE LOCAL STORAGE

      fb_data: JSON.stringify({
        fbc: getCookie("_fbc"), // AUTOMATICALLY STORED BY FACEBOOK IN COOKIES
        fbp: getCookie("_fbp"), // AUTOMATICALLY STORED BY FACEBOOK IN COOKIES
      }),
    },
  );

export const page = async ({
  category,
  name,
  ...props
}: {
  category: string;
  name: string;
}) => await analytics?.page(category, name, { ...props });
