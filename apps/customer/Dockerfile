FROM node:slim AS base
RUN apk update && apk add --no-cache libc6-compat
RUN yarn global add turbo@^2

FROM base AS builder
WORKDIR /build
COPY . .
RUN turbo prune @retrade/rt-client-customer --docker

FROM base AS installer
WORKDIR /installer
ARG API_BASE_URL
ENV NEXT_API_BASE_URL=${API_BASE_URL}

COPY --from=builder /build/out/json/ ./
RUN yarn install --frozen-lockfile
 
COPY --from=builder /build/out/full/ ./
RUN yarn turbo run build
 
FROM base AS runner
WORKDIR /app
 
RUN addgroup --system --gid 1001 retrade
RUN adduser --system --uid 1001 retrade
USER retrade

COPY --from=installer --chown=retrade:retrade /installer/apps/customer/.next/standalone ./
COPY --from=installer --chown=retrade:retrade /installer/apps/customer/.next/static ./apps/customer/.next/static
COPY --from=installer --chown=retrade:retrade /installer/apps/customer/public ./apps/customer/public

ENTRYPOINT [ "node", "apps/customer/server.js" ]