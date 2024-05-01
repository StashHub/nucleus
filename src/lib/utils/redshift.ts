import { PhoneType, type Prisma } from "@prisma/client";
import { type Customer, type CustomerPhone } from "@/lib/types";

export const name = (customer: Customer) => {
  return `${customer.contract_signer_first_name} ${customer.contract_signer_last_name}`;
};

export const phone = (number: string | null): string | null =>
  number ? number.replace(/\D/g, "") : null;

export const industry = (value: string) => {
  return value ?? "Other";
};

export const boolean = (value: string | null) => {
  return Boolean(value && value.toLowerCase() === "yes");
};

// const Rounds = ["PPP", "PPP2", "Both"] as const;
// type Round = (typeof Rounds)[number];

// const validRound = (type: string): type is Round => {
//   return Rounds.includes(type as Round);
// };

// const ppp = (customer: Customer) => {
//   const type = customer.ppp_round_participated ?? "";
//   if (!validRound(type)) return;

//   const pppData = {
//     PPP: {
//       type: "Round 1",
//       coverage: customer.ppp_round_1_coverage,
//       disbursement:
//         customer.ppp_round_1_disbursement &&
//         new Date(customer.ppp_round_1_disbursement).toISOString(),
//       amount: customer.ppp_round_1_amount,
//       received: true,
//       forgiven: customer.ppp_round_1_forgiven,
//     } satisfies Prisma.PPPUncheckedUpdateInput,
//     PPP2: {
//       type: "Round 2",
//       coverage: customer.ppp_round_2_coverage,
//       disbursement:
//         customer.ppp_round_2_disbursement &&
//         new Date(customer.ppp_round_2_disbursement).toISOString(),
//       amount: customer.ppp_round_2_amount,
//       received: true,
//       forgiven: customer.ppp_round_2_forgiven,
//     } satisfies Prisma.PPPUncheckedUpdateInput,
//   };

//   return type === "Both" ? [pppData.PPP, pppData.PPP2] : [pppData[type]];
// };

// type Year = "2020" | "2021";
// type Quarter = "1" | "2" | "3" | "4";

// const covid = (customer: Customer) => {
//   const quarters = customer.covid_affected_quarters
//     ?.split(";")
//     .map((quarter) => quarter.trim())
//     .sort();

//   const affectedQuarters = quarters?.map((quarter) => {
//     const [year, quarterNumber] = quarter.split("Q").map((t) => t.trim());

//     const disruptionProperty = `n_${year as Year}_q_${
//       quarterNumber as Quarter
//     }_disrupted_whole_quarter` as const;

//     const negativeProperty = `n_${year as Year}_q_${
//       quarterNumber as Quarter
//     }_10_disruption` as const;

//     const periodProperty = `n_${year as Year}_q_${
//       quarterNumber as Quarter
//     }_disruption_period` as const;

//     const disruption = customer[disruptionProperty];
//     const negative = customer[negativeProperty];
//     const coverage = customer[periodProperty];

//     const properties = [disruption, negative, coverage];
//     if (properties.some((prop) => prop === undefined)) {
//       return null;
//     }

//     return {
//       ref: quarter,
//       affected: disruption,
//       negative: negative, // 10 %
//       coverage: coverage,
//     };
//   });

//   return {
//     disruption: customer.covid_disruptions?.split(";"),
//     statement: customer.covid_impact,
//     quarters: { create: affectedQuarters?.filter(Boolean) },
//   } satisfies Prisma.CovidCreateWithoutCompanyInput;
// };

export const userData = (customer: Customer) => {
  return { name: name(customer), emailVerified: new Date() };
};

export const phoneData = (customer: Customer, id: string): CustomerPhone => {
  return {
    type: PhoneType.MOBILE,
    number: phone(customer.phone_number),
    userId: id,
  };
};

export const companyData = ({
  customer,
  ownerId,
}: {
  customer: Customer;
  ownerId: string;
}) => {
  return {
    ownerId: ownerId,
    id: String(customer.primary_associated_company_id),
    name: customer.company_name,
    dba: customer.dba,
    ein: customer.ein,
    industry: industry(customer.industry),
    revenue: customer.annual_income,
    filingType: customer.filing_type,
    website: customer.website,
    emp2019: Number(customer.emp2019),
    emp2020: Number(customer.emp2020),
    emp2021: Number(customer.emp2021),
    pt2019: Number(customer.pt2019),
    pt2020: Number(customer.pt2020),
    pt2021: Number(customer.pt2021),
    n941xSent:
      customer.n_941_x_sent_date &&
      new Date(customer.n_941_x_sent_date).toISOString(),
    n941xSigned:
      customer.n_941_x_signed_date &&
      new Date(customer.n_941_x_signed_date).toISOString(),
    n8821xSent:
      customer.n_8821_sent_date &&
      new Date(customer.n_8821_sent_date).toISOString(),
    n8821xSigned:
      customer.n_8821_signed_date &&
      new Date(customer.n_8821_signed_date).toISOString(),
    started: customer.business_start_date,
    deal: {
      create: {
        id: String(customer.deal_id),
        name: customer.dealname,
        cloned: customer.cloned_deal_id,
        pipeline: customer.pipeline_name,
        stage: customer.active_stage_label,
        hubspotOwner: customer.hubspot_owner,
        hubspotContactId: String(customer.hubspot_contact_id),
        estimatedRefund: Number(customer.estimated_refund_amount),
        awaitingRefundDate:
          customer.awaiting_refund_date &&
          new Date(customer.awaiting_refund_date).toISOString(),
        closed:
          customer.closedate && new Date(customer.closedate).toISOString(),
      },
    },
    // affiliation: {
    //   create: {
    //     fundOwnership: boolean(customer.fundownership),
    //     ownership: boolean(customer.ownership),
    //     claimedCredits: boolean(customer.claimed_credits),
    //     owner: boolean(customer.owner_80_percent),
    //     controllingInterest: boolean(customer.controlling_interest),
    //     serviceGroup: boolean(customer.service_group),
    //     embargoed: boolean(customer.embargoed),
    //     registeredBank: boolean(customer.registered_bank),
    //     govermental: boolean(customer.governmental),
    //   },
    // },
    addresses: {
      create: {
        street: customer.street,
        city: customer.city,
        state: customer.state,
        postal: String(customer.postal_code),
      },
    },
    // ppp: { create: ppp(customer) },
    // owners: {
    //   create: {
    //     name: name(customer),
    //     stake: 80,
    //     payroll: true,
    //     members: {
    //       create: {
    //         name: "",
    //         relationship: "",
    //         payroll: false,
    //         notes: '',
    //       },
    //     },
    //   },
    // },
    // peo: {
    //   create: {
    //     name: customer.peo_name,
    //     usesOwnEIN: false, // missing
    //     collaborates: boolean(customer.peo_collaboration),
    //     requiresERC: false, // missing
    //     requestedERC: false, // missing
    //     fee: customer.peo_fee,
    //     funding: "", // missing
    //     started: customer.peo_start_date,
    //     ended: customer.peo_end_date,
    //   },
    // },
    // covid: { create: covid(customer) },
    guardian: {
      create: {
        url: customer.consent_url,
        consent: customer.consent_url,
        status: customer.irsstatus,
      },
    },
  } satisfies Prisma.CompanyUncheckedCreateInput;
};
