<div align="center">
  <img width="869" height="166" alt="image" src="https://github.com/user-attachments/assets/e340895c-bc4c-4e66-ba9e-cf4123cc2818" />
</div>

# Welcome to the Collabify app repository!

This repository contains the source code for the Collabify application, a platform for collaboration. The project is split into a `client` (React/Vite) and a `server` (NestJS/PostgreSQL).

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
- [Backend Setup (Server)](#backend-setup-server)
  - [Project setup](#project-setup)
  - [Run NestJS locally, build and run PostgreSQL in docker environment](#run-nestjs-locally-build-and-run-postgresql-in-docker-environment)
  - [Build and run the project using docker-compose.yml file](#build-and-run-the-project-using-docker-composeyml-file)
  - [Run tests](#run-tests)
  - [How to connect to the Postgres database using Docker Desktop container](#how-to-connect-to-the-postgres-database-using-docker-desktop-container)
- [Frontend Setup (Client)](#frontend-setup-client)
  - [Project setup](#project-setup-1)
  - [Running the client](#running-the-client)
- [Running the Full Application](#running-the-full-application)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Backend Setup (Server)

The backend is a NestJS application. All commands should be run from the `/server` directory.

### Project setup

```bash
# Navigate to the server directory
cd server

# Install npm dependencies
npm install
```

### Run NestJS locally, build and run PostgreSQL in docker environment

First, you need to create `.env` and `.env.production` files inside the `/server` directory. You can copy the secrets from given example files.

Build and start the database container:

```bash
# From the root directory
docker compose --env-file server/.env up --build -d database
```

Stop the containers:

```bash
docker compose down
```

Add `-v` to remove the database volume (clears all data):

```bash
docker compose down -v
```

Run the application in `/server` directory:

```bash
# Development mode
npm run start:dev
```

Finally, run the seed script to populate database with test entities:

```bash
npm run seed
```

### Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

### How to connect to the Postgres database using Docker Desktop container

1.  Build and run the project.
2.  Open terminal, and type `docker exec -it <postgres container name> psql -U postgres`.
3.  Use command `\c collabify-database` to connect to the database.
4.  Next, select a specific entity table, type:

```sql
-- users table
SELECT * FROM users;
```

## Frontend Setup (Client)

The frontend is a React application built with Vite. All commands should be run from the `/client` directory.

### Project setup

```bash
# Navigate to the client directory
cd client

# Install npm dependencies
npm install
```

### Running the client

First, you need to create a `.env` file in the `/client` directory with `.env.example` content.

To run the client in development mode:

```bash
# Starts the development server
npm run dev
```

Your application should now be running with the client available at `http://localhost:5173` (or another port if 5173 is busy) and the server at `http://localhost:5000`.
