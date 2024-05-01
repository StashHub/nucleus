FROM node:20-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY prisma prisma
# Omit --production flag for TypeScript devDependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

COPY . .

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG SKIP_ENV_VALIDATION=true
ENV SKIP_ENV_VALIDATION=${SKIP_ENV_VALIDATION}

ARG NEXT_PUBLIC_SEGMENT_WRITE_KEY
ENV NEXT_PUBLIC_SEGMENT_WRITE_KEY=${NEXT_PUBLIC_SEGMENT_WRITE_KEY}

ENV NODE_ENV=production

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js based on the preferred package manager
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm build; \
  else yarn build; \
  fi

# Step 2. Production image, copy all the files and run next
FROM base AS runner
RUN \
  corepack enable && \
  corepack prepare pnpm@8.10.0 --activate

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma/  

# Environment variables must be redefined at run time
ARG NEXT_PUBLIC_SEGMENT_WRITE_KEY
ENV NEXT_PUBLIC_SEGMENT_WRITE_KEY=${NEXT_PUBLIC_SEGMENT_WRITE_KEY}

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

CMD ["node", "server.js"]