FROM node:slim AS base
RUN yarn global add turbo@^2

FROM base AS builder
WORKDIR /build
COPY . .
RUN turbo prune @retrade/rt-client-customer --docker
FROM base AS installer
WORKDIR /installer
ARG API_BASE_URL
ARG NODE_ENV
ENV NEXT_API_BASE_URL=${API_BASE_URL}
ENV NEXT_PUBLIC_NODE_ENV=${NODE_ENV}
COPY --from=builder /build/out/json/ ./
RUN yarn install

COPY --from=builder /build/out/full/ ./
RUN turbo run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 retrade
RUN adduser --system --uid 1001 retrade
USER retrade

COPY --from=installer --chown=retrade:retrade /installer/apps/customer/.next/standalone ./
COPY --from=installer --chown=retrade:retrade /installer/apps/customer/.next/static ./apps/customer/.next/static
COPY --from=installer --chown=retrade:retrade /installer/apps/customer/public ./apps/customer/public

ENTRYPOINT [ "node", "apps/customer/server.js" ]
