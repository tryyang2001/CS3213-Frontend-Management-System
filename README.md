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

Follow these steps to set up and run the project for local development:

1. Clone the repository: `git clone https://github.com/tryyang2001/CS3213-Frontend-Management-System.git`
2. Copy `.env` files obtained from the drive into directories: `frontend`, `backend/assignment-service`, `backend/user-service`, and `backend/grading-service` respectively
3. At the root directory, run `yarn setup` to install all dependencies for all microservices. Take note that this process might take longer to finish (< 10 mins)
4. At the root directory, you may start the development server: `yarn dev`

To run service individually, you will need to change path directory to the target directory, and follow by `yarn dev`. For example, to run only `assignment-service`:

```
cd backend/assignment-service
yarn dev
```

## Production Build and Deployment

Follow these steps to build and run the project in production environment:

1. Follow steps 1, 2, and 3 in local development for setting up the project
2. At the root directory, you may start the server by running `yarn start`

## Contact

If you encountered any problem or need clarification from the developers, kindly contact tanruiyang01@u.nus.edu.
