import { faker } from "@faker-js/faker";
import { PrismaClient, Role, PhoneType } from "@prisma/client";
import type { Prisma } from "@prisma/client";

import pkg from "bcryptjs";

const { hash } = pkg;
const prisma = new PrismaClient();

enum Rounds {
  Round1 = "Round 1",
  Round2 = "Round 2",
}

enum Forgiven {
  Yes = "Yes",
  No = "No",
  Pending = "Pending",
}

enum TAXSTATUS {
  AVAILABLE = "Available",
  PENDING = "Pending Consent",
  REJECTED = "Rejected by IRS",
  TAXPAYER = "Waiting on Taxpayer",
  WAITING = "Waiting on IRS",
}

type Account = {
  name: string;
  email: string;
};

const accounts: Account[] = [
  {
    name: "Test Account",
    email: "tester@getrefunds.com",
  },
];

async function main() {
  const password = await hash("password123", 12);

  const getYearQuarter = (date: Date) => {
    const year = date.getFullYear();
    const quarter = Math.floor(date.getMonth() / 3) + 1;

    return `${year} Q${quarter}`;
  };

  const specificAccounts = accounts.map((account) => ({
    id: faker.string.uuid(),
    name: account.name,
    image: faker.image.avatar(),
    password: password,
    emailVerified: faker.date.recent(),
    phones: {
      create: {
        type: faker.helpers.objectValue(PhoneType),
        number: faker.phone.number(),
      },
    },
    role: faker.helpers.objectValue(Role),
    email: account.email,
    consent: faker.date.recent(),
    consent_signature: faker.helpers.maybe(() => faker.person.fullName(), {
      probability: 0.5,
    }),
  })) satisfies Prisma.UserCreateManyInput[];

  const users = [
    ...specificAccounts,
    ...Array.from({ length: 30 }, () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      image: faker.image.avatar(),
      password: password,
      emailVerified: faker.date.recent(),
      phones: {
        create: {
          type: faker.helpers.objectValue(PhoneType),
          number: faker.phone.number(),
        },
      },
      role: faker.helpers.objectValue(Role),
      email: faker.internet.email().toLowerCase(),
      consent: faker.date.recent(),
      consent_signature: faker.helpers.maybe(() => faker.person.fullName(), {
        probability: 0.5,
      }),
    })),
  ] satisfies Prisma.UserCreateManyInput[];

  const companies = Array.from({ length: 32 }, () => ({
    ownerId: faker.helpers.arrayElement(users).id,
    id: faker.string.uuid(),
    name: faker.company.name(),
    dba: faker.company.name(),
    ein: faker.finance.routingNumber(),
    industry: faker.company.catchPhraseNoun(),
    revenue: faker.finance.amount(1000, 20000, 2),
    filingType: faker.company.buzzNoun(),
    website: faker.internet.url(),
    emp2019: faker.number.int(100),
    emp2020: faker.number.int(100),
    emp2021: faker.number.int(100),
    pt2019: faker.number.int(100),
    pt2020: faker.number.int(100),
    pt2021: faker.number.int(100),
    n941xSent: faker.date.recent(),
    n941xSigned: faker.date.recent(),
    n8821xSent: faker.date.recent(),
    n8821xSigned: faker.date.recent(),
    started: faker.date.recent(),
    created: faker.date.recent().toISOString(),
    deal: {
      create: {
        id: faker.string.uuid(),
        name: faker.company.name(),
        cloned: faker.helpers.maybe(() => faker.string.nanoid(), {
          probability: 0.5,
        }),
        pipeline: faker.company.buzzNoun(),
        stage: faker.hacker.ingverb(),
        hubspotOwner: faker.person.fullName(),
        hubspotContactId: faker.string.uuid(),
        estimatedRefund: faker.finance.amount(30000, 500000, 2),
        awaitingRefundDate: faker.date.recent(),
        closed: faker.date.recent(),
      },
    },
    affiliation: {
      create: {
        fundOwnership: faker.datatype.boolean(),
        ownership: faker.datatype.boolean(),
        claimedCredits: faker.datatype.boolean(),
        owner: faker.datatype.boolean(),
        controllingInterest: faker.datatype.boolean(),
        serviceGroup: faker.datatype.boolean(),
        embargoed: faker.datatype.boolean(),
        registeredBank: faker.datatype.boolean(),
        govermental: faker.datatype.boolean(),
      },
    },
    addresses: {
      create: Array.from(
        { length: faker.number.int({ min: 1, max: 3 }) },
        () => ({
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          postal: faker.location.zipCode(),
        }),
      ),
    },
    owners: {
      create: Array.from(
        { length: faker.number.int({ min: 1, max: 4 }) },
        () => ({
          name: faker.person.fullName(),
          stake: faker.number.int(100),
          payroll: faker.datatype.boolean(),
          members: {
            create: Array.from(
              { length: faker.number.int({ min: 1, max: 3 }) },
              () => ({
                name: faker.person.fullName(),
                relationship: faker.helpers.arrayElement(["Sibling", "Spouse"]),
                payroll: faker.datatype.boolean(),
                notes: faker.lorem.text(),
              }),
            ),
          },
        }),
      ),
    },
    ppp: {
      create: Array.from(
        { length: faker.number.int({ min: 1, max: 2 }) },
        () => ({
          type: faker.helpers.enumValue(Rounds),
          disbursement: faker.date.recent(),
          coverage: faker.date.recent().toString(),
          amount: faker.finance.amount(100, 20000, 0),
          received: faker.datatype.boolean(),
          forgiven: faker.helpers.enumValue(Forgiven),
        }),
      ),
    },
    peo: {
      create: {
        name: faker.company.name(),
        usesOwnEIN: faker.datatype.boolean(),
        collaborates: faker.datatype.boolean(),
        requiresERC: faker.datatype.boolean(),
        requestedERC: faker.datatype.boolean(),
        fee: faker.finance.amount(100, 1000, 0, "$"),
        funding: faker.finance.transactionType(),
        started: faker.date.recent(),
        ended: faker.date.recent(),
      },
    },
    covid: {
      create: {
        disruption: faker.helpers.multiple(() => faker.word.words(), {
          count: faker.number.int({ min: 2, max: 4 }),
        }),
        statement: faker.lorem.paragraphs(),
        quarters: {
          create: Array.from(
            { length: faker.number.int({ min: 4, max: 8 }) },
            () => ({
              id: faker.string.uuid(),
              ref: getYearQuarter(faker.date.past({ years: 5 })),
              affected: faker.datatype.boolean(),
              negative: faker.datatype.boolean(),
              coverage: faker.date.recent().toString(),
            }),
          ),
        },
      },
    },
    guardian: {
      create: {
        url: faker.internet.url(),
        consent: faker.internet.url(),
        status: faker.helpers.enumValue(TAXSTATUS),
      },
    },
  })) satisfies Prisma.CompanyUncheckedCreateInput[];

  const deleteUsers = prisma.user.deleteMany();
  const deleteTokens = prisma.verificationToken.deleteMany();

  const [t, x] = await prisma.$transaction([deleteUsers, deleteTokens]);
  console.log(`Database purged (${t.count + x.count} records)`);

  await prisma.$transaction(async (tx) => {
    for (const user of users) {
      await tx.user.create({ data: user });
    }
    for (const company of companies) {
      await tx.company.create({ data: company });
    }
  });

  // map deal to accounts
  accounts.map(async (account) => {
    const user = await prisma.user.update({
      where: { email: account.email },
      data: {
        companies: {
          connect: { id: faker.helpers.arrayElement(companies).id },
        },
      },
    });

    const company = await prisma.company.findFirstOrThrow({
      where: { ownerId: user.id },
    });

    await prisma.company.update({
      where: { id: company.id },
      data: {
        deal: {
          update: {
            id: process.env.TEST_DEAL_ID,
          },
        },
        guardian: {
          update: {
            data: { status: TAXSTATUS.AVAILABLE },
          },
        },
      },
    });
  });

  console.log(`Database has been seeded. 🌱`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
