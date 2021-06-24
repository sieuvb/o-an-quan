FROM locmai/node:16-alpine3.11-lerna-0

WORKDIR /app

COPY ./*.json ./

COPY ./packages/shared/*.json ./packages/shared/

COPY ./packages/backend/*.json ./packages/backend/

RUN npx lerna bootstrap

RUN yarn

COPY . .

EXPOSE 3003

CMD ["yarn","start:be"]