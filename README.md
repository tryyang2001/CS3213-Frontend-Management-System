# Intelligent Tutoring System (ITS)

## Description

Intelligent Tutoring System (ITS) is a platform that can provide high-level feedbacks to coding assignment automatically. It aims to alleviate the workload required for grading coding assignments.

## Project Structure

This project represents the frontend user interfaces of the ITS platform. We are running microservice architecture on the project:

```
├── backend
│ ├── assignment-service
│ ├── user-service
| └── grading-service
├── frontend
├── package.json
├── LICENSE
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Prerequisites

Before running the project, make sure you have access to the following:

- [NodeJS](https://nodejs.org/en/download) environment with version 20 and above
- [Environmental secrets](https://drive.google.com/drive/folders/1yuXEM5f18HtmWPlxYBW2Lmy--jwZ68ck?usp=sharing) for each microservice

## Local Development

There are two way to set up/run the project in local enviroment:
### Run the project using yarn:

1. Clone the repository: `git clone https://github.com/tryyang2001/CS3213-Frontend-Management-System.git`
2. Copy `.env` files obtained from the drive into directories: `frontend`, `backend/assignment-service`, `backend/user-service`, and `backend/grading-service` respectively
3. At the root directory, run `yarn setup` to install all dependencies for all microservices. Take note that this process might take longer to finish (< 10 mins)
4. At the root directory, you may start the development server: `yarn dev`

To run service individually, you will need to change path directory to the target directory, and follow by `yarn dev`. For example, to run only `assignment-service`:

```
cd backend/assignment-service
yarn dev
```
## Production Build
There are 2 ways to run production build in local environment

### Run the project using `yarn`

Follow these steps to build and run the project in production environment:

1. Follow steps 1, 2, and 3 in local development for setting up the project
2. At the root directory, you may start the server by running `yarn start`

### Run the project using Docker Engine:
Follow these steps to build and run the project in production environment:
1. Clone the repository: `git clone https://github.com/tryyang2001/CS3213-Frontend-Management-System.git`
2. Copy `.env` files obtained from the drive into directories: `frontend`, `backend/assignment-service`, `backend/user-service`, and `backend/grading-service` respectively
3. Ensure you have Docker Engine installed, if not check out Docker documentation on [how to install Docker Engine](https://docs.docker.com/engine/install/). Open Docker Engine
4. At the root directory run `docker-compose up`
5. After all containers are up, run the application at `localhost:80`

## Deployment

We are using Containers as an Application (CaaS) approach for our microservices deployment. We chose Azure as the cloud platform with its Azure Container Registry (ACR) for pushing/storing/pulling build images and Azure Kubernetes Service (AKS) for orchestration between services and setting up API gateway using ingress-nginx. The steps of our deployment:
1. Authenticate with Azure/ACR/AKS
2. Build images for each microservices and push them to ACR
3. Execute kuberenetes manifest files in `k8s/startup.yaml` to set up services/deployment and ingress-nginx

You can find the similar deploying flow in our Continuous Deployment (CD) in `.github/workflows/CD_to_AKS.yml`
## Contact

If you encountered any problem or need clarification from the developers, kindly contact tanruiyang01@u.nus.edu.
