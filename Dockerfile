FROM node:20-slim AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && \
    cp -R node_modules /prod_node_modules
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL=https://boyunxi.cn
ARG NEXTAUTH_URL=https://boyunxi.cn
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
RUN npx prisma generate && \
    npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=deps /prod_node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/package.json ./
COPY entrypoint.sh ./
COPY backup.sh ./
RUN chmod +x entrypoint.sh backup.sh
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
VOLUME ["/app/data"]
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server.js"]
