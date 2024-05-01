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
import { sha256 } from "@/lib/utils";
import { Analytics } from "@segment/analytics-node";

const writeKey = env.SERVER_SEGMENT_WRITE_KEY ?? "****";

const analytics = new Analytics({ writeKey });

export default analytics;

export const group = async ({
  groupId,
  identifier,
  ...props
}: {
  groupId: string;
  identifier: string;
}) =>
  analytics.group({
    groupId,
    userId: await sha256(identifier),
    traits: { ...props },
  });

export const identify = async ({
  identifier,
  ...props
}: {
  identifier: string;
}) => analytics.identify({ userId: await sha256(identifier), ...props });

export const track = async ({
  label,
  identifier,
  ...props
}: {
  label: string;
  identifier: string;
}) =>
  analytics.track({
    event: label,
    userId: await sha256(identifier),
    ...props,
  });

export const page = async ({
  category,
  name,
  identifier,
  ...props
}: {
  category: string;
  name: string;
  identifier: string;
}) =>
  analytics.page({
    category,
    name,
    userId: await sha256(identifier),
    ...props,
  });
