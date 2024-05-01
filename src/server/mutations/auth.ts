import { client } from "@/api/client";

export const register = {
  key: "signup",
  mutation: async (
    email: string,
    password?: string,
  ): Promise<{ message: string }> => {
    const credentials = { email, password };
    const response = await client.post<{ message: string }>(
      "/auth/signup",
      credentials,
    );
    return response.data;
  },
} as const;

export const resetPasswordEmail = {
  key: "forgot-password",
  mutation: async (email?: string): Promise<{ message: string }> => {
    const response = await client.post<{ message: string }>("/auth/password", {
      email,
    });
    return response.data;
  },
} as const;

export const resetPassword = {
  key: "reset-password",
  mutation: async (
    password: string,
    token: string | null,
  ): Promise<{ message: string }> => {
    try {
      const res = await client.post<{ message: string }>(
        "/auth/password/reset",
        { password, token },
      );
      return res.data;
    } catch (e) {
      throw new Error("TODO: handle error");
    }
  },
} as const;

export const changePassword = {
  key: "change-password",
  mutation: async (
    currentpassword: string,
    password: string,
  ): Promise<{ message: string }> => {
    const res = await client.post<{ message: string }>(
      "/auth/password/change",
      { currentpassword, password },
    );
    return res.data;
  },
} as const;

export const verifyOtp = {
  key: "verify-otp",
  mutation: async (otp: string): Promise<{ message: string }> => {
    const res = await client.post<{ message: string }>("/auth/verify/", {
      otp,
    });
    return res.data;
  },
} as const;

export const resendOtp = {
  key: "resend-otp",
  mutation: async (email: string): Promise<{ message: string }> => {
    const res = await client.post<{ message: string }>("/auth/verify/send", {
      email,
    });
    return res.data;
  },
} as const;

export const userConsent = {
  key: "user-consent",
  mutation: async (
    email: string,
    signature: string,
  ): Promise<{ message: string }> => {
    const res = await client.post<{ message: string }>("auth/signup/consent", {
      email,
      signature,
    });
    return res.data;
  },
} as const;
