FROM node:22-slim AS base
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server.ts tsconfig.json ./
COPY src/lib/auth-server.ts src/lib/

RUN npm install tsx

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npx", "tsx", "server.ts"]
