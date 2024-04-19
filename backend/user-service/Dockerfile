FROM node:alpine
ARG PROD_ENV=""
WORKDIR '/app'
COPY package*.json ./
RUN yarn install

COPY . .

RUN if [ ! -f ".env" ]; then printf "$PROD_ENV" >> .env; fi

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start"]