FROM node:alpine
WORKDIR '/app'
COPY package*.json ./
RUN yarn install

COPY . .

RUN printf "$PROD_ENV" >> .env

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start"]