import { describe, test, expect } from "vitest";
import { getInitials } from "../getInitials";

describe("getInitials", () => {
  test("returns initials for name", () => {
    const name = "john doe";
    expect(getInitials(name)).toBe("JD");
  });

  test("returns only first initial for first name", () => {
    const name = "john";
    expect(getInitials(name)).toBe("J");
  });

  test("returns default initials for empty string", () => {
    const name = "";
    expect(getInitials(name)).toBe("IR");
  });

  test("return first and last initial of multi name", () => {
    const name = "Marry Middle Lou";
    expect(getInitials(name)).toBe("ML");
  });
});
