FROM node:lts-alpine as tsc
WORKDIR /tmp/lgpt
COPY . .
RUN npm install && npm run compile

FROM node:lts-alpine as lgpt-bot
WORKDIR /bot
COPY --from=tsc /tmp/lgpt/build/ .
COPY --from=tsc /tmp/lgpt/package.json .
COPY --from=tsc /tmp/lgpt/package-lock.json .
RUN npm install
ENTRYPOINT ["node", "main.js"]