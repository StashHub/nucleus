import { vi, describe, test, expect } from "vitest";
import { ebg13, qrpbqr } from "../crypt";

vi.mock("@/env.mjs", () => {
  return {
    env: {
      DATABASE_URL: "",
      SHADOW_DATABASE_URL: "",
      NODE_ENV: "",
      NEXTAUTH_SECRET: "",
      NEXTAUTH_URL: "",
      NEXT_PUBLIC_SENTRY_DSN: "",
      SENTRY_AUTH_TOKEN: "",
      MAILGUN_DOMAIN: "",
      MAILGUN_API_KEY: "",
      NODEMAILER_EMAIL: "",
      AWS_S3_BUCKET: "",
      AWS_PROFILE: "",
      PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK: "",
    },
  };
});

describe("ebg13", () => {
  test("rotate and rerotate returns correct string", () => {
    const decoded = { a: "rot13", b: "Hello World!" };
    const encoded = { a: "ebg13", b: "Uryyb Jbeyq!" };
    expect(ebg13(decoded.a)).toBe(encoded.a);
    expect(ebg13(encoded.a)).toBe(decoded.a);
    expect(ebg13(decoded.b)).toBe(encoded.b);
    expect(ebg13(encoded.b)).toBe(decoded.b);
  });
});

describe("qrpbqr", () => {
  test("decodes correctly", () => {
    const text = "helloworld@innovationrefunds.com";
    const base64 = btoa(text);
    const encoded = ebg13(base64);
    const rerot = ebg13(encoded);
    const decoded = atob(rerot);

    expect(base64).toBe("aGVsbG93b3JsZEBpbm5vdmF0aW9ucmVmdW5kcy5jb20=");
    expect(encoded).toBe("nTIfoT93o3WfMROcoz5iqzS0nJ9hpzIzqJ5xpl5wo20=");
    expect(rerot).toBe("aGVsbG93b3JsZEBpbm5vdmF0aW9ucmVmdW5kcy5jb20=");
    expect(decoded).toBe(text);
    expect(qrpbqr(encoded)).toBe(decoded);
  });

  test("returns empty string for exceptions", () => {
    const alreadyAtob = atob("aGVsbG93b3JsZEBpbm5vdmF0aW9ucmVmdW5kcy5jb20=");
    expect(qrpbqr(alreadyAtob)).toBe("");
  });
});
