import { type E164Number, parsePhoneNumber } from "libphonenumber-js";

export function formatPhone(phone: string): string {
  return parsePhoneNumber(
    phone.replace(/\s+/g, "") as E164Number,
    "US",
  ).formatNational();
}
