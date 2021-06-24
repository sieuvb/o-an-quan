FROM locmai/node:16-alpine3.11-lerna-0

WORKDIR /app

COPY ./*.json ./

COPY ./packages/shared/*.json ./packages/shared/

COPY ./packages/frontend/*.json ./packages/frontend/

RUN npx lerna bootstrap

RUN yarn

COPY . .

RUN yarn build:prod

RUN yarn global add serve
EXPOSE 3000

CMD ["serve","-s","/app/packages/frontend/build","-l","tcp://0.0.0.0:3000"]