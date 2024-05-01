import { client } from "@/pages/api/client";
import { type UserCompanies } from "@/lib/types";

export const getUserProfile = {
  key: "user-profile",
  query: async (): Promise<UserCompanies> =>
    (await client.get<UserCompanies>("/auth/account")).data,
} as const;
