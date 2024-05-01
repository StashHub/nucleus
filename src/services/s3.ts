import { z } from "zod";
import { env } from "@/env.mjs";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  type GetObjectCommandOutput,
  type _Object,
} from "@aws-sdk/client-s3";

const Schema = z.object({ keys: z.array(z.string()) });
export type KeyProps = z.infer<typeof Schema>;

const client = new S3Client({ region: "us-east-1" });
const AWS_S3_BUCKET = env.AWS_S3_BUCKET;

// retrieve list of contents in bucket(s)
const executeS3Command = async ({ keys }: KeyProps) => {
  const allContents: _Object[] = [];

  for (const key of keys) {
    const prefixToExclude = `${key}/documents/Data Agg Sheet`;
    const command = new ListObjectsV2Command({
      Bucket: AWS_S3_BUCKET,
      Prefix: key,
    });

    const response = await client.send(command);
    const contents = response.Contents ?? [];

    // Filter out keys that start with the specified prefix
    const filteredContents = contents.filter(
      (file) => !file.Key?.startsWith(prefixToExclude),
    );

    allContents.push(...filteredContents);
  }

  return allContents;
};

// retrieves object metadata by bucket key
const object = async (key: string): Promise<GetObjectCommandOutput> => {
  const command = new GetObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
  });
  return await client.send(command);
};

// list objects and return an array of their keys
const objects = async ({ keys }: KeyProps): Promise<string[]> => {
  const files = await executeS3Command({ keys: keys });
  return files.map((file) => file.Key ?? "");
};

// count documents in subdirectories of S3 bucket
const counter = async ({ keys }: KeyProps): Promise<Record<string, number>> => {
  const counts: Record<string, number> = {};
  const files = await executeS3Command({ keys: keys });
  files.forEach((file) => {
    const subdirectory = file.Key?.split("/")[1];
    if (subdirectory) {
      counts[subdirectory] = (counts[subdirectory] ?? 0) + 1;
    }
  });
  return counts;
};

export { counter, object, objects };
