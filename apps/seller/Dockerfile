FROM node:20-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
RUN yarn global add turbo@^2

FROM base AS builder
WORKDIR /build
COPY . .
RUN turbo prune @retrade/rt-client-seller --docker

FROM base AS installer
WORKDIR /installer

COPY --from=builder /build/out/json/ ./
RUN yarn install --frozen-lockfile
 
COPY --from=builder /build/out/full/ ./
RUN yarn turbo run build
 
FROM base AS runner
WORKDIR /app
 
RUN addgroup --system --gid 1001 retrade
RUN adduser --system --uid 1001 retrade
USER retrade

COPY --from=installer --chown=retrade:retrade /installer/apps/partner/.next/standalone ./
COPY --from=installer --chown=retrade:retrade /installer/apps/partner/.next/static ./apps/partner/.next/static
COPY --from=installer --chown=retrade:retrade /installer/apps/partner/public ./apps/partner/public

ENTRYPOINT [ "node", "apps/seller/server.js" ]