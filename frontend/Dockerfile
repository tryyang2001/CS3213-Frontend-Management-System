# Use Node.js base image
FROM node:alpine AS base

ARG PROD_ENV=""

WORKDIR /base

COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy rest of the application files
COPY . .
RUN if [ ! -f ".env" ]; then printf "$PROD_ENV" >> .env; fi

# STAGE 2: build
FROM base AS build

WORKDIR /build

COPY --from=base /base ./
COPY --from=base /base/.env ./

RUN yarn build


# STAGE 3: app
FROM node:alpine AS app
WORKDIR /app
COPY --from=build /build/package.json ./
COPY --from=build /build/yarn.lock ./
COPY --from=build /build/.next ./.next/
COPY --from=build /build/public ./public/
COPY --from=build /build/node_modules ./node_modules/
COPY --from=build /build/next.config.js ./

EXPOSE 3000
CMD ["yarn", "start"]