FROM node:20 AS base
WORKDIR /vietnam-sea/client
RUN useradd --create-home --shell /bin/bash vietnamsea

FROM node:20 AS build
WORKDIR /build
COPY . .
RUN yarn install --frozen-lockfile && yarn build

FROM base AS prod
WORKDIR /vietnam-sea/client
USER vietnamsea
COPY --chown=vietnamsea --from=build /build/.next ./.next
COPY --chown=vietnamsea --from=build /build/node_modules ./node_modules
COPY --chown=vietnamsea --from=build /build/package.json /build/yarn.lock /build/next.config.mjs ./
COPY --chown=vietnamsea --from=build /build/public ./public

ENTRYPOINT [ "yarn", "start" ]