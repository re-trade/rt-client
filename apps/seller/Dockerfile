FROM node:alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat
RUN yarn global add turbo

FROM base AS builder
WORKDIR /build
COPY . .
RUN turbo prune @retrade/rt-client-seller --docker

FROM base AS installer
WORKDIR /installer
ARG API_BASE_URL
ARG SOCKET_URL
ARG NODE_ENV
ARG CUSTOMER_PORTAL_URL
ENV NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}
ENV NEXT_PUBLIC_SOCKET_URL=${SOCKET_URL}
ENV NEXT_PUBLIC_NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_CUSTOMER_PORTAL_URL=${CUSTOMER_PORTAL_URL}
COPY --from=builder /build/out/json/ ./
RUN yarn install --production=false
COPY --from=builder /build/out/full/ ./
RUN yarn turbo build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 retrade
RUN adduser --system --uid 1001 retrade
USER retrade

COPY --from=installer --chown=retrade:retrade /installer/apps/seller/.next/standalone ./
COPY --from=installer --chown=retrade:retrade /installer/apps/seller/.next/static ./apps/seller/.next/static
COPY --from=installer --chown=retrade:retrade /installer/apps/seller/public ./apps/seller/public

ENTRYPOINT [ "node", "apps/seller/server.js" ]
