import Redis from "ioredis";
import { Queue, Worker, QueueEvents, MetricsTime, type Job } from "bullmq";

import { prisma } from "@/server/db";
import { type User } from "@prisma/client";

import { type Customer } from "@/lib/types";
import { getCustomerQuery } from "@/server/queries/company";
import { RedshiftService } from "@/services/redshift";

import { userData, phoneData, companyData, phone } from "@/lib/utils/redshift";
import { env } from "@/env.mjs";

export const queueName = "user-sync";
export const connection = new Redis(
  Number(env.REDIS_MASTER_SERVICE_PORT),
  env.REDIS_MASTER_SERVICE_HOST,
  {
    enableOfflineQueue: false,
    maxRetriesPerRequest: null,
  },
);

export const queue = new Queue(queueName, {
  connection: connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnFail: { age: 24 * 3600 }, // keep up to 24 hours
    removeOnComplete: {
      age: 3600, // keep up to 1 hour
      count: 1000, // keep up to 1000 jobs
    },
  },
});

const worker = new Worker(
  queueName,
  async (job: Job) => {
    await job.log(`Start processing job ${job.id}`);

    const client = new RedshiftService();
    const { email } = job.data as { email: string };
    const customer = await client.executeStatement<Customer>({
      sql: getCustomerQuery,
      parameters: [{ name: "email", value: email }],
    });

    const addedUsers: string[] = [];

    await prisma.$transaction(async (prisma) => {
      await customer.reduce(
        async (accPromise: Promise<User[]>, customer: Customer) => {
          const acc = await accPromise;

          const user = await prisma.user.update({
            where: { email: email },
            data: userData(customer),
          });

          await prisma.phone.upsert({
            where: { userId: user.id, number: phone(customer.phone_number) },
            update: phoneData(customer, user.id),
            create: phoneData(customer, user.id),
          });

          await prisma.company.upsert({
            where: { id: String(customer.primary_associated_company_id) },
            update: companyData({ customer: customer, ownerId: user.id }),
            create: companyData({ customer: customer, ownerId: user.id }),
          });

          addedUsers.push(user.id);

          return [...acc, user];
        },
        Promise.resolve([]),
      );
    });
    return addedUsers;
  },
  {
    connection: connection,
    concurrency: 10,
    metrics: {
      maxDataPoints: MetricsTime.ONE_WEEK * 2,
    },
  },
);

worker.on("error", (error) => {
  console.error(error);
});

const queueEvents = new QueueEvents(queueName, { connection });

queueEvents.on("completed", (job) => {
  console.log(`Job ${job.jobId} completed with result:`, job.returnvalue);
});

queueEvents.on("failed", (job) => {
  console.error(`Job ${job.jobId} failed with error:`, job.failedReason);
});

const gracefulShutdown = (signal: string): void => {
  console.log(`Received ${signal}, closing server...`);
  queue
    .close()
    .then(() => {
      worker
        .close()
        .then(() => {
          process.exit(0);
        })
        .catch((error) => {
          console.log("Error closing worker", error);
          process.exit(1);
        });
    })
    .catch((error) => {
      console.log("Error during shutdown:", error);
      process.exit(1);
    });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
