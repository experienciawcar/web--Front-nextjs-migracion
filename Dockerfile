# syntax=docker/dockerfile:1
# Imagen para Cloud Run (servicio web-wcar). Usa output: "standalone".
FROM node:22-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@12.6.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# En la imagen se decide explícitamente qué dependencias pueden correr scripts
# (el pnpm-workspace.yaml local las deja sin resolver y pnpm 12 aborta).
RUN printf 'allowBuilds:\n  sharp: true\n  unrs-resolver: false\n' > pnpm-workspace.yaml \
 && pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
# NEXT_PUBLIC_* se incrusta en el build, por eso entra como argumento.
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node_modules/.bin/next build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=8080
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m nextjs
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]
