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
ARG GIT_COMMIT=dev
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
# 部署版本号（由 deploy.sh 传入 git 短哈希），构建期内联到客户端
ENV NEXT_PUBLIC_APP_VERSION=${GIT_COMMIT}
RUN npx prisma generate && \
    npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG IMAGES_REMOTE_HOSTS=boyunxi.cn
ENV IMAGES_REMOTE_HOSTS=${IMAGES_REMOTE_HOSTS}
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=deps /prod_node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/package.json ./
COPY entrypoint.sh ./
COPY backup.sh ./
RUN chmod +x entrypoint.sh backup.sh \
    && mkdir -p /app/data/backups/rolling /app/data/backups/daily \
    && chown -R node:node /app
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
VOLUME ["/app/data"]
# 非 root 运行
USER node
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.status===200?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server.js"]
