# Assignment Service

This service contains a RESTful API for creating, retrieving, updating, and deleting assignments/questions. It should support fundamental interaction between tutors and the system to create, update, and delete assignment questions, as well as both tutors and users to view the questions.

## Getting started

To start using the service, kindly install all the necessary dependencies by running the following command:

```
yarn
```

Once installed, you need to create a local environment file called `env` directly under the `assignment-service` folder.
Copy the `POSTGRESQL_DB_URL` link that you have obtained to the `env` file like this:

```
POSTGRESQL_DB_URL=<REPLACE_WITH_YOUR_POSTGRESQL_DB_URL>
```

Next, you may proceed to start the service in development environment by running the command:

```
yarn dev
```

Or if you prefer running the service in production environment, please build the service first by running:

```
yarn build
```

and follow by

```
yarn start
```

And you may start calling the Assignment API now through Postman, Thunder Client, or any relevant client agents.

## API Documentation

To read more about what are the endpoints supported in the API, kindly refer to xxx.
