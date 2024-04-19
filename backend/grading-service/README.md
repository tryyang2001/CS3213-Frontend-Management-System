# Grading Service

This project is built on top of NodeJS with ExpressJS and TypeScript. Please ensure that you have Node installed with version >= 20.

## Instruction to set up

Please ensure that you have obtained the necessary **environmental variables** from the code owner. These include:

```
ITS_API_URL = <REPLACE_WITH_THE_ACTUAL_VALUE>
POSTGRESQL_DB_URL = <REPLACE_WITH_THE_ACTUAL_VALUE>
```
There are two ways to set up the service locally

### Set up using `yarn`:

1. Run `yarn` or `yarn install` to install all the necessary dependencies
2. To start the server in dev mode, simply run `yarn dev`.
3. To start the server in prod mode, run `yarn build` follow by `yarn start`.

### Set up using Docker Engine:
1. Ensure you have Docker Engine installed, if not check out Docker documentation on [how to install Docker Engine](https://docs.docker.com/engine/install/). Open Docker Engine
2. Build docker image `docker build .`
3. Run container at port 8080 `docker run -p 8088:8088 -it`

After that, you may proceed to making API requests using Postman or any other agent tools as your choice. The server will start running on **port 8088** locally.
