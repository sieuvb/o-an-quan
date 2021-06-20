FROM locmai/node:16-alpine3.11-lerna

WORKDIR /app

COPY ./*.json ./

COPY ./packages/backend/*.json ./packages/backend/

RUN npx lerna bootstrap

COPY . .

EXPOSE 3003

CMD ["yarn","start:be"]