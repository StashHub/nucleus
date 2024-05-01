import pkg, { genSalt } from "bcryptjs";
import { type TokenType } from "@/lib/types";
import { env } from "@/env.mjs";

import { createHash, randomBytes } from "crypto";

const { hash: hashPass } = pkg;

export async function hash(password: string) {
  const salt = await genSalt(15);
  return await hashPass(password, salt);
}

// Hash a verification token using SHA256 and a secret
export function hashToken(token: string) {
  return createHash("sha256")
    .update(`${token}${env.NEXTAUTH_SECRET}`)
    .digest("hex");
}

// Generate a random 6-digit code
function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a verification token with an expiration date
export function generateVerificationToken(type: TokenType) {
  const ONE_HOUR_IN_SECONDS = 3600;
  const ONE_DAY_IN_SECONDS = 86400;

  // Generate token or code based on the type
  const token =
    type === "token" ? randomBytes(32).toString("hex") : generateSixDigitCode();

  // Calculate expiration date based on the type
  const expires = new Date(
    Date.now() +
      (type === "token" ? ONE_DAY_IN_SECONDS : ONE_HOUR_IN_SECONDS) * 1000,
  );

  return { token, expires };
}

export const ebg13 = (input: string): string => {
  return input.replace(/[a-zA-Z]/g, (char) => {
    const offset = char.toLowerCase() <= "m" ? 13 : -13;
    return String.fromCharCode(char.charCodeAt(0) + offset);
  });
};

export const qrpbqr = (encoded: string): string => {
  try {
    const etb = ebg13(encoded);
    return atob(etb);
  } catch {
    return "";
  }
};

export const sha256 = async (str: string) => {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str),
  );
  return Array.prototype.map
    .call(new Uint8Array(buf), (x: bigint) => ("00" + x.toString(16)).slice(-2))
    .join("");
};
