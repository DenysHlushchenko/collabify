# Collabify NestJS Backend Setup

The following document follows a basic setup and build instructions of Collabify prototype application.

## Prerequisites

Docker Desktop

## Project setup

```bash
# Install npm dependencies
$ npm install
```

## Build and run the project

Build and start the containers:

```bash
# development
$ docker compose up --build -d
```

Stop the containers:

```bash
$ docker compose down
```

Add `-v` to remove the database volume (clears all data):

```bash
$ docker compose down -v
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## How to connect to the Postgres database using Docker Desktop container

1. Build and run the project.
2. Open terminal, and type `docker exec -it <postgres container name> psql -U postgres`.
3. Use command `\c nestjs-prototype-postgres` to connect to the database.
4. Next, select a specific entity table, type:

````bash
# users table
SELECT * FROM users;


## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
````

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.
