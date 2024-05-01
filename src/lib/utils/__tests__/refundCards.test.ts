import { describe, test, expect } from "vitest";
import { formatDate, formatAmount } from "../refundCards";

describe("formatDate", () => {
  test("returns a properly formatted date", () => {
    const date = "2024-01-25";
    expect(formatDate(date)).toBe("Jan 25, 2024");
  });
  test("returns Invalid Date for bad input", () => {
    const date = "";
    expect(formatDate(date)).toBe("Invalid Date");
  });
});

describe("formatAmount", () => {
  test("returns a properly formatted amount", () => {
    expect(formatAmount(1234.56)).toBe("$1,234.56");
    expect(formatAmount(0)).toBe("$0");
    expect(formatAmount(NaN)).toBe("$NaN");
  });
});
