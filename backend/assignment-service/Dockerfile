FROM node:latest
ARG PROD_ENV=""
COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY . .

RUN if [ ! -f ".env" ]; then printf "$PROD_ENV" >> .env; fi

RUN yarn build

EXPOSE 8080

CMD ["yarn", "start"]