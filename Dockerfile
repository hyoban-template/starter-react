FROM node:18-alpine as build-stage

WORKDIR /app
RUN corepack enable

COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./entrypoint.sh /app/entrypoint.sh

EXPOSE 80

RUN chmod +x /app/entrypoint.sh
CMD /app/entrypoint.sh
