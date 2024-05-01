![dashboard](https://github.com/InnovationRefunds/nucleus/assets/122959281/dde82fcd-d382-4bf2-abe4-57ec84f269b1)

<div align='center'>
    <h1>Nucleus</h1>
    <p>Simplify data unification with a centralized hub</p>
</div>

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-t3-app`](https://create.t3.gg/).

## :construction_worker_man: Getting Started

First, run the development server:

```bash
pnpm i && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs.

- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Shadcn](https://ui.shadcn.com/)

## :key: SSO
To interact with AWS resources locally, configure AWS SSO for the desired environment.

#### Prerequisite

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en)
- [AWS CLI](https://aws.amazon.com/cli/)

#### Configuration

To assist with the creation of a SSO profile, please refer to the `Makefile`:

```bash
Usage: make <target> profile=<profile> env=<environment (dev,qa,prod)>
Targets:
  login        Log in using AWS SSO
  dev          Run development server
  seed         Run database seed
  migration    Run database migration
  studio       Open Prisma Studio
```

1. Run the following command to configure AWS SSO for your desired environment:
> This sets the default `profile` and `environment` respectively: `nucleus`, `dev`
```bash
make dev
```

> This opens your browser to configure/login to AWS SSO. Upon success, you will be given temporary credentials using the configured role. 

2. Run the following command to create a `new` AWS SSO profile for a specific environment. The process will attempt to login to exisitng profile, if exist, or prompt otherwise.
```bash
make dev profile=<profile> env=<environment>
```

3. Follow the prompts to set up the correct AWS and IAM role.
```bash
SSO session name (Recommended): <profile>-<env>
SSO start URL [None]: https://awsinnovationrefunds.awsapps.com/start
SSO region [None]: us-east-1

# Choose from available AWS accounts and roles.

CLI default client Region [None]: us-east-1
CLI default output format [None]: json
```

3. Update your `.env` file with the name of the profile you just created.
```dotenv
AWS_PROFILE=<profile>-<env>
AWS_S3_BUCKET=<bucket>
```

## :floppy_disk: Prisma

[Prisma](https://prisma.io) is the database toolkit used in this project, providing a seamless and type-safe way to interact with the database. Here are some key points for using Prisma effectively in the application.

#### 1. Prisma Client

The Prisma Client is auto-generated based on the database shema defined in `schema.prisma`. It provides a type-safe API for the database queries, making it easier to work with the data in a type-safe manner.

##### Example usage:
```javascript
// pages/api/users
import { db } from "@/server/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse<User[]>) {
  const users = await db.user.findMany();
  res.status(200).json(users);
}
```

#### 2. Advanced Queries

Prisma supports advanced query features such as filtering, sorting, and pagination. Leverage these features to efficiently retrieve and manipulate data from the database.

##### Example usage:
```javascript
import { db } from "@/server/db";

await prisma.$transaction(async (tx) => {
  // 1. Create a new user ...
  const user = await db.user.create({
    data: {
      email: "burk@prisma.io",
      name: "Nikolas Burk",
    },
  });

  // 2. ... then load the number of users in the database ...
  const count = await prisma.user.count();

  // 3. ... and use the `count` as information in a new query
  await prisma.post.create({
    data: {
      title: `I am user #${count} in the database.`,
      authorId: user.id,
    },
  });
});
```

For more advanced features, visit [Prisma playground](https://playground.prisma.io/examples/advanced/transactions/batch)

#### 3. Relationships

Utilize Prisma's support for defining and querying relationships between models. This allows us to model complex data structures and retrieve related data seamlessly.

##### Example usage:
```javascript
model Post {
  id         Int        @id @default(autoincrement())
  title      String
  published  Boolean    @default(false)
  author     User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId   Int
}

const publishedAuthors = await prisma.user.findMany({
  include: {
    posts: {
      where: {
        published: true,
        /**
         * Feel free to uncomment the lines below to add more filters to your query
         */
        // title: {
        //   contains: 'Prisma'
        // }
      },
    },
  },
});
```

#### 4. Migrations

Prisma supports migrations to manage changes to the database schema. As the project evolves, use migrations to update the database schema without losing data.

```bash
npx prisma migrate dev # To apply migrations in development
npx prisma migrate deploy # To apply migrations in production
```

## :package: Git conventions

Below, you can find git conventions that should be followed within the whole repository.

### Commit messages

- Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
strategy according to this pattern:
`type(optional scope): write short message in lower case and imperative`
- Commit types are following:
  - `feat` - feature development
  - `fix` - bug fix
  - `refactor` - refactoring
  - `docs` - documentation
  - `test` - tests
  - `chore` - grunt tasks (no production code change)
  - `style` - code style change
- Examples:
  - `feat(company-info): add delete button`
  - `chore: setup repository`

### Branches naming

- Start branch with the same type as for commit messages, described above.
- Follow the type with slash and short description of the change in `lowercase` and `kebab-case`.
- Examples:
  - `feat/delete-button`
  - `chore/repository-setup`

## :rocket: Deployment

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

### :books: Additional Resources

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

Happy coding! :rocket: