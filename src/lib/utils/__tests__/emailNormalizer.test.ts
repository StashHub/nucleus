import { describe, test, expect } from "vitest";
import { emailNormalizer } from "../emailNormalizer";

describe("emailNormalizer", () => {
  test("returns normalized email", () => {
    const email = "hello@world.com";
    expect(emailNormalizer(email)).toBe("hello@world.com");
  });
});
