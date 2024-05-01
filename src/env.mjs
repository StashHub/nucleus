import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url().optional(),
    SHADOW_DATABASE_URL: z.string().url().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    MAILGUN_DOMAIN: z.string(),
    MAILGUN_API_KEY: z.string(),
    MAILGUN_URL: z.string().url().optional(),
    NODEMAILER_EMAIL: z.string(),
    REDIS_MASTER_SERVICE_HOST: z.string().default("172.20.43.53"),
    REDIS_MASTER_SERVICE_PORT: z.string().default("6379"),
    TEST_DEAL_ID: z.string().optional(),
    AWS_S3_BUCKET: z.string().optional(),
    AWS_PROFILE: z.string().optional(),
    AWS_REDSHIFT_CLUSTER: z.string(),
    AWS_SA_SECRET_ARN: z.string(),
    AWS_ASSUME_ROLE_ARN: z.string(),
    PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK: z.boolean().default(true),
    SERVER_SEGMENT_WRITE_KEY: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
    NEXT_PUBLIC_SEGMENT_WRITE_KEY: z.string().optional(),
    NEXT_PUBLIC_VWO_ACCOUNT_ID: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    SHADOW_DATABASE_URL: process.env.SHADOW_DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SEGMENT_WRITE_KEY: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
    MAILGUN_URL: process.env.MAILGUN_URL,
    NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
    REDIS_MASTER_SERVICE_HOST: process.env.REDIS_MASTER_SERVICE_HOST,
    REDIS_MASTER_SERVICE_PORT: process.env.REDIS_MASTER_SERVICE_PORT,
    TEST_DEAL_ID: process.env.TEST_DEAL_ID,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_PROFILE: process.env.AWS_PROFILE,
    AWS_REDSHIFT_CLUSTER: process.env.AWS_REDSHIFT_CLUSTER,
    AWS_SA_SECRET_ARN: process.env.AWS_SA_SECRET_ARN,
    AWS_ASSUME_ROLE_ARN: process.env.AWS_ASSUME_ROLE_ARN,
    PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK:
      process.env.PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK,
    SERVER_SEGMENT_WRITE_KEY: process.env.SERVER_SEGMENT_WRITE_KEY,
    NEXT_PUBLIC_VWO_ACCOUNT_ID: process.env.NEXT_PUBLIC_VWO_ACCOUNT_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
