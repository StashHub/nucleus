/* eslint-disable */

import { client } from "@/pages/api/client";
import { CompanyEstimate, type ResponseData } from "@/lib/types";
import { CreditResponse } from "@/lib/types";

export const getTaxGuardianData = {
  key: "tax-guardian-credits",
  query: async (id?: string): Promise<CreditResponse> =>
    (await client.get<CreditResponse>(`/dashboard/${id}/credits`)).data,
} as const;

export const getDocumentsCount = {
  key: "total-documents",
  query: async (keys: string[]): Promise<ResponseData> =>
    (await client.get<ResponseData>(`/case/documents/${keys.join("/")}`)).data,
} as const;

export const getRefundEstimate = {
  key: "estimate",
  mutation: async (companyId: string): Promise<CompanyEstimate> => {
    const res = await client.post<CompanyEstimate>("/dashboard/estimate", {
      companyId,
    });
    return res.data;
  },
} as const;

export const getQuarterSummaryQuery = `
  SELECT
    E.TGCODE,
    MAX(E.CREATE_DATE) AS CREATE_DATE,
    E.PERIOD_YYYYMM,
    E.NOTICE_DATE,
    E.TGSHORT_DESCRIPTION,
    E.AMOUNT,
    'Q'
    || TO_CHAR(TO_DATE(E.PERIOD_YYYYMM, 'YYYYMM'), 'Q')
    || ' '
    || TO_CHAR(TO_DATE(E.PERIOD_YYYYMM, 'YYYYMM'), 'YYYY') AS QUARTER
  FROM
      ANALYTICS.RPT_PRODUCT.HONEYPOT_ERC_NUCLEUS_DATA_PHASE1 N
      INNER JOIN ANALYTICS.RPT_PRODUCT.TAXGUARDIAN__CUSTOMERS C ON N.DEAL_ID = C.EXTERNAL_ID
      INNER JOIN ANALYTICS.RPT_PRODUCT.TAXGUARDIAN__EVENTS E on C.EXTERNAL_ID = E.CUSTOMER_EXTERNAL_ID
  WHERE
      N.DEAL_ID = :deal
      AND TO_DATE(E.PERIOD_YYYYMM, 'YYYYMM') > '2019-01-01'
  GROUP BY
      N.LEGAL_COMPANY_NAME,
      E.TGCODE,
      E.PERIOD_YYYYMM,
      E.NOTICE_DATE,
      E.TGSHORT_DESCRIPTION,
      E.AMOUNT
  ORDER BY
      TO_DATE(PERIOD_YYYYMM, 'YYYYMM') ASC,
      NOTICE_DATE DESC,
      TGCODE DESC,
      CREATE_DATE DESC;
`;

export const getCustomerQuery = `
  WITH BASE AS
    (SELECT 
      C.*,
      C.COMPANY_ID AS PRIMARY_ASSOCIATED_COMPANY_ID,
      C.EIN AS FEIN,
      D.*,
      TC.CONSENT_URL,
      TC.IRSSTATUS
    FROM ANALYTICS.RPT_PRODUCT.IR__COMPANY_PROFILES C
    INNER JOIN ANALYTICS.RPT_PRODUCT.IR__HONEYPOT_ERC_DEALS D USING(COMPANY_ID)
    LEFT JOIN ANALYTICS.RPT_PRODUCT.TAXGUARDIAN__CUSTOMERS TC ON D.DEAL_ID = TC.EXTERNAL_ID
    WHERE FEIN IS NOT NULL AND NULLIF(TRIM(FEIN), '') IS NOT NULL)
  SELECT 
    PRIMARY_ASSOCIATED_COMPANY_ID,
    COMPANY_NAME,
    TRIM(REPLACE(FEIN, ' ', '')) AS EIN,
    INITCAP(DBA) AS DBA,
    PHONE_NUMBER,
    INDUSTRY,
    ANNUAL_INCOME,
    FILING_TYPE,
    WEBSITE,
    NVL(NUMBER_OF_EMPLOYEES_2019, 0) AS EMP2019,
    NVL(NUMBER_OF_EMPLOYEES_2020, 0) AS EMP2020,
    NVL(NUMBER_OF_EMPLOYEES_2021, 0) AS EMP2021,
    NVL(NUMBER_OF_PARTTIME_EMPLOYEES_2019, 0) AS PT2019,
    NVL(NUMBER_OF_PARTTIME_EMPLOYEES_2020, 0) AS PT2020,
    NVL(NUMBER_OF_PARTTIME_EMPLOYEES_2021, 0) AS PT2021,
    CASE
      WHEN ADDRESS_LINE_1 LIKE '%' || ADDRESS_LINE_2 || '%' THEN INITCAP(ADDRESS_LINE_1)
      ELSE INITCAP(CONCAT(ADDRESS_LINE_1, CONCAT(' ', NVL(ADDRESS_LINE_2, ''))))
    END AS STREET,
    INITCAP(CITY) AS CITY,
    STATE, 
    POSTAL_CODE,
    LOWER(NVL(TAX_GUARDIAN_URL, CONSENT_URL)) AS CONSENT_URL,
    NVL(TAX_GUARDIAN_STATUS, IRSSTATUS) AS IRSSTATUS,
    COVID_IMPACT,
    COVID_AFFECTED_QUARTERS,
    COVID_DISRUPTIONS,
    N_8821_SENT_DATE,
    N_8821_SIGNED_DATE,
    N_941_X_SENT_DATE,
    N_941_X_SIGNED_DATE,
    BUSINESS_START_DATE,
    DEAL_ID,
    CLONED_DEAL_ID,
    PIPELINE_NAME,
    ACTIVE_STAGE_LABEL,
    DEALNAME,
    HUBSPOT_OWNER_FULL_NAME AS HUBSPOT_OWNER,
    CONTRACT_SIGNER_CONTACT_ID AS HUBSPOT_CONTACT_ID,
    LOWER(TRIM(CONTRACT_SIGNER_EMAIL)) AS CONTRACT_SIGNER_EMAIL,
    INITCAP(CONTRACT_SIGNER_FIRST_NAME) AS CONTRACT_SIGNER_FIRST_NAME,
    INITCAP(CONTRACT_SIGNER_LAST_NAME) AS CONTRACT_SIGNER_LAST_NAME,
    ESTIMATED_REFUND_AMOUNT,
    AWAITING_REFUND_DATE,
    CLOSEDATE
  FROM BASE
  WHERE CONTRACT_SIGNER_EMAIL = :email
`;
