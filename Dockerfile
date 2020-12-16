FROM node:12-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:12-alpine

WORKDIR /srv/app
USER node
COPY --from=builder --chown=node:node /app/node_modules/ ./node_modules/
COPY --chown=node:node . ./

EXPOSE 3000

ENTRYPOINT ["node", "index.js"]
