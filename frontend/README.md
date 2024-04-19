# Frontend Service

![Frontend CI](https://github.com/tryyang2001/CS3213-Frontend-Management-System/actions/workflows/frontend_CI.yml/badge.svg)

This project is built on top of NodeJS with NextJS, ReactJS, and TypeScript. Please ensure that you have Node installed with version >= 20.

## Instruction to set up

There are two ways to set up frontend locally
### Set up using `yarn`:

1. Run `yarn` or `yarn install` to install all the necessary dependencies
2. To start the server in dev mode, simply run `yarn dev`.
3. To start the server in prod mode, run `yarn build` follow by `yarn start`.

### Set up using Docker Engine:
1. Ensure you have Docker Engine installed, if not check out Docker documentation on [how to install Docker Engine](https://docs.docker.com/engine/install/). Open Docker Engine
2. Build docker image `docker build .`
3. Run container at port 8080 `docker run -p 3000:3000 -it`

After that, you may proceed to making API requests using Postman or any other agent tools as your choice. The server will start running on **port 3000** locally.
