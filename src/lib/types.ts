import { type Icons } from "@/components/ui/icons";
import { type ReactNode } from "react";
import { Prisma } from "@prisma/client";

export type TokenType = "token" | "code";

export type SignUpParams = {
  email: string;
  password: string;
  terms: boolean;
};

export type SignUpConsentParams = {
  email: string;
  signature: string;
};

export type ResendParams = {
  email: string;
};

export enum PAGES {
  DASHBOARD = "Dashboard",
  ERC = "Employee Retention Credit",
  SETTINGS = "Settings",
}

export type MenuLink = {
  label: PAGES;
  url: string | ReactNode;
  icon: keyof typeof Icons;
  iconInactive: keyof typeof Icons;
  active: boolean;
  fillOpacity?: string;
};

export type SuccessContextProps = {
  success: boolean;
  setSuccess: (state: boolean) => void;
};

export type ResponseData = { message: string };
export type ResponseError = { error: string };

// Define a type that includes the relation to `Company`
export const userWithCompanies = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    companies: { include: { deal: { select: { id: true, cloned: true } } } },
    phones: true,
  },
});
export type UserCompanies = Prisma.UserGetPayload<typeof userWithCompanies>;

// Define a type that includes the relation to `Deal`
export const companyWithEstimates =
  Prisma.validator<Prisma.CompanyDefaultArgs>()({
    select: {
      deal: { select: { estimatedRefund: true } },
      emp2020: true,
      emp2021: true,
      pt2020: true,
      pt2021: true,
    },
  });
export type CompanyEstimate = Prisma.CompanyGetPayload<
  typeof companyWithEstimates
>;

export const companyWithDeal = Prisma.validator<Prisma.CompanyDefaultArgs>()({
  include: { deal: { select: { id: true, cloned: true } } },
});
export type CompanyDeal = Prisma.CompanyGetPayload<typeof companyWithDeal>;

export type CreditResponse = {
  quarters: QuarterSummary[];
  url: string | undefined | null;
  signed8821: boolean;
};

export type CovidQuarters = {
  ref: string;
  affected: boolean | null;
};

export type QuarterSummary = {
  quarter: string;
  summary: Summary;
};

export type Summary = {
  total: number;
  events: Event[];
};

export type Event = {
  tgcode: string;
  notice_date: string;
  tgshort_description: string;
  amount: number;
};

export type FormattedEvent = {
  title: string;
  css: string;
  icon: JSX.Element;
  notice_date: string;
};

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

export type Customer = Nullable<{
  dba: string;
  phone_number: string;
  annual_income: string;
  filing_type: string;
  website: string;
  street: string;
  city: string;
  state: string;
  consent_url: string;
  irsstatus: string;
  covid_impact: string;
  covid_affected_quarters: string;
  covid_disruptions: string;
  business_start_date: string;
  hubspot_owner: string;
  hubspot_contact_id: string;
  estimated_refund_amount: number;
  awaiting_refund_date: string | Date;
  closedate: string | Date;
  n_8821_sent_date: string | Date;
  n_8821_signed_date: string | Date;
  n_941_x_sent_date: string | Date;
  n_941_x_signed_date: string | Date;
}> &
  Required<{
    primary_associated_company_id: string;
    company_name: string;
    ein: string;
    industry: string;
    postal_code: number;
    deal_id: string;
    cloned_deal_id: string;
    dealname: string;
    active_stage_label: string;
    pipeline_name: string;
    contract_signer_email: string;
    contract_signer_first_name: string;
    contract_signer_last_name: string;
    emp2019: number;
    emp2020: number;
    emp2021: number;
    pt2019: number;
    pt2020: number;
    pt2021: number;
  }>;

export const userPhones = Prisma.validator<Prisma.PhoneDefaultArgs>()({});
export type CustomerPhone = Pick<
  Prisma.PhoneGetPayload<typeof userPhones>,
  "type" | "number"
> & { userId: string };
