FROM locmai/node:16-alpine3.11-lerna

WORKDIR /app

COPY ./*.json ./

COPY ./packages/frontend/*.json ./packages/frontend/

RUN npx lerna bootstrap

COPY . .

EXPOSE 3000

CMD ["yarn","start:fe"]