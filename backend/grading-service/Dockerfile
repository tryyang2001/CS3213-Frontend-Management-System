FROM node:latest

COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8088

CMD ["yarn", "start"]