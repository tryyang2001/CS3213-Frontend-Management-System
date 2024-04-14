FROM node:alpine
ARG PROD_ENV=""
COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY . .

RUN if [ ! -f ".env" ]; then printf "$PROD_ENV" >> .env; fi

RUN yarn build-docker

EXPOSE 8088

CMD ["yarn", "start"]