/* eslint-disable */

import { hash } from "@/lib/utils";
import { group } from "@/services/segment/server";
import { Prisma, PrismaClient, type User } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// -- Extensions --

// Extend prisma client with custom functionality
export const prisma = db
  .$extends({
    client: {
      $log: (s: string) => console.log(s),
    },
  })
  .$extends({
    model: {
      $allModels: {
        // `exists` method available on all models
        async exists<T>(
          this: T,
          where: Prisma.Args<T, "findFirst">["where"],
        ): Promise<boolean> {
          // Get the current model at runtime
          const context = Prisma.getExtensionContext(this);
          const result = await (context as any).findFirst({ where });
          return result !== null;
        },
        // `getById` method available on all models
        async getById<T>(
          this: T,
          id: string,
        ): Promise<Prisma.Result<T, { id: string }, "findUniqueOrThrow">> {
          const context = Prisma.getExtensionContext(this);
          return await (context as any).findUniqueOrThrow({ where: { id } });
        },
      },
    },
  })
  .$extends({
    // Extend the user `create` query for password hashing
    query: {
      user: {
        async create({ operation, args, query }) {
          if (["create", "update"].includes(operation)) {
            if (args.data.password) {
              const hashedPassword = hash(args.data.password);
              args.data.password = await hashedPassword;
            }
          }
          return query(args);
        },
      },
      company: {
        async create({ operation, args, query }) {
          if (["create", "update"].includes(operation)) {
            await group({
              identifier: "server@localhost",
              groupId: args.data.ein,
              ...{ tgStatus: args.data.guardian?.connect?.status }, // test is required
            });
          }
          return query(args);
        },
      },
    },
  })
  .$extends({
    result: {
      user: {
        firstName: {
          needs: {
            name: true,
          },
          compute(user) {
            return user.name?.split(" ")[0];
          },
        },
      },
    },
  });
