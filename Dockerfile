# Stage 1: Build the application
FROM node:20-alpine AS builder

# Define build-time arguments for environment variables
ARG DATABASE_URL
ARG WEBHOOK_SECRET

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_CHAT_SERVER_URL
ARG NEXT_PUBLIC_ADMIN_USER_ID
ARG NEXT_PUBLIC_ADMIN_WALLET_ID

# Set them as environment variables
ENV DATABASE_URL=$DATABASE_URL
ENV WEBHOOK_SECRET=$WEBHOOK_SECRET
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_CHAT_SERVER_URL=$NEXT_PUBLIC_CHAT_SERVER_URL
ENV NEXT_PUBLIC_ADMIN_USER_ID=$NEXT_PUBLIC_ADMIN_USER_ID
ENV NEXT_PUBLIC_ADMIN_WALLET_ID=$NEXT_PUBLIC_ADMIN_WALLET_ID

# Install necessary system dependencies for Prisma
RUN apk add --no-cache libc6-compat openssl3

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

RUN npm run build

# Stage 2: Run the application
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

# Use environment variables from docker-compose or deployment platform
ENV NODE_ENV=production \
    PORT=3000

CMD [ "npm", "run", "start" ]