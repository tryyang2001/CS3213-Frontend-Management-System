FROM node:16-alpine
WORKDIR '/app'
COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE 3001

CMD ["ts-node", "index.ts"]