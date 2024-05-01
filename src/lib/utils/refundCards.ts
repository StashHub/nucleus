import dayjs from "dayjs";

// IRS payload (tgcode) lookup
export enum TGCODE {
  ERC_1_1 = "ERC-1.1", // Amended tax return received
  ERC_1_2 = "ERC-1.2", // Amended tax return sent back to originator
  ERC_1_3 = "ERC-1.3", // Amended tax return filed
  REF_1_1 = "REF-1.1", // Refund issued
  REF_1_2 = "REF-1.2", // Undelivered Refund, Returned to IRS
  DEFAULT = "default", // Default initial event
}

// Refund status by tgcode
export const REFUND_STATUS = {
  ISSUED: [TGCODE.REF_1_1],
  SENT_BACK: [TGCODE.ERC_1_2],
  RECEIVED: [TGCODE.ERC_1_1],
  FILED: [TGCODE.ERC_1_3],
  RETURNED: [TGCODE.REF_1_2],
  DEFAULT: [TGCODE.DEFAULT],
} as const;

export const isAllowedTGCode = (
  value: string,
): value is keyof typeof TGCODE => {
  return Object.values(TGCODE).includes(value as TGCODE);
};

export const isRefundStatusCode = <S extends keyof typeof REFUND_STATUS>(
  value: string,
  status: S,
): value is (typeof REFUND_STATUS)[typeof status][number] => {
  // Array.prototype.includes infers union readonly type incorrectly, casting as never
  return REFUND_STATUS[status].includes(value as never);
};

export enum QUARTER {
  Q1_2020 = "2020 Q1",
  Q2_2020 = "2020 Q2",
  Q3_2020 = "2020 Q3",
  Q4_2020 = "2020 Q4",
  Q1_2021 = "2021 Q1",
  Q2_2021 = "2021 Q2",
  Q3_2021 = "2021 Q3",
  Q4_2021 = "2021 Q4",
}

export const isQuarter = (value: string): value is keyof typeof QUARTER => {
  return Object.values(QUARTER).includes(value as QUARTER);
};

// Format date for refund cards
export function formatDate(date: string): string {
  return dayjs(date).format("MMM D, YYYY");
}

// Format dollar amounts for refund cards
export function formatAmount(amount: number): string {
  const options = {
    maximumFractionDigits: 2,
  };

  return `$${Intl.NumberFormat("en-US", options).format(amount)}`;
}
