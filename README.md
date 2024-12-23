# metric-tracking Project

## Overview

`metric-tracking` is a backend API project built with two different frameworks: **Express.js** and **NestJS**. Both frameworks serve similar purposes, providing endpoints to manage and retrieve metric data, but they use different approaches to structuring the codebase, programming paradigms, and different technologies for the database layer:

- **Express.js** version: Uses **MongoDB** and **Mongoose** for data management, and follows a **Functional Programming (FP)** approach.
- **NestJS** version: Uses **PostgreSQL** and **TypeORM** for data management, and follows an **Object-Oriented Programming (OOP)** approach.

Both versions use **Yarn** as the package manager for dependency management.

---

## Express.js Application

### Description:

The **Express.js** version provides a RESTful API for managing metrics. It uses **MongoDB** as the database and **Mongoose** as the ORM to interact with MongoDB. The codebase follows a **Functional Programming (FP)** approach.

### Technologies:

- **Framework**: Express.js
- **Database**: MongoDB
- **ORM**: Mongoose
- **Programming Paradigm**: Functional Programming
- **Environment**: Node.js
- **Package Manager**: Yarn

### Setup:

1. Clone the repository:

   ```bash
   git clone https://github.com/trandiepphuong/metric-tracking.git
   ```

2. Navigate to the `express` folder:

   ```bash
   cd metric-tracking/express
   ```

3. Install dependencies using Yarn:

   ```bash
   yarn install
   ```

4. Set up MongoDB database configuration:

   - Ensure you have a MongoDB instance running locally or use a cloud provider like MongoDB Atlas.
   - Add your MongoDB connection string to `.env`.

5. Start the server:

   ```bash
   yarn start
   ```

6. The Express API will be available at `http://localhost:3000`.

7. Run the tests:
   ```bash
   yarn test
   ```

### Endpoints:

- `POST /metrics`: Create a new metric.
- `GET /metrics`: Retrieve metrics by type and user.
- `GET /metrics/chart`: Get data to draw a chart for a specific time period.

---

## NestJS Application

### Description:

The **NestJS** version provides the same functionality but uses **PostgreSQL** and **TypeORM** for data management. NestJS is built on top of Express.js, using decorators, dependency injection, and a modular architecture. It follows an **Object-Oriented Programming (OOP)** approach, where classes and objects are central to organizing the codebase.

### Technologies:

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Programming Paradigm**: Object-Oriented Programming
- **Package Manager**: Yarn

### Setup:

1. Clone the repository:

   ```bash
   git clone https://github.com/trandiepphuong/metric-tracking.git
   ```

2. Navigate to the `nest` folder:

   ```bash
   cd metric-tracking/nest
   ```

3. Install dependencies using Yarn:

   ```bash
   yarn install
   ```

4. Set up PostgreSQL database configuration:

   - Ensure you have a PostgreSQL instance running locally or use a cloud provider like Heroku Postgres.
   - Add your PostgreSQL connection details to `.env`.

5. Start the server:

   ```bash
   yarn start
   ```

6. The NestJS API will be available at `http://localhost:3000`.

7. Run the tests:
   ```bash
   yarn test
   ```

### Endpoints:

- `POST /metrics`: Create a new metric.
- `GET /metrics`: Retrieve metrics by type and user.
- `GET /metrics/chart`: Get data to draw a chart for a specific time period.

---

## Testing with Jest

Both the **Express.js** and **NestJS** versions use **Jest** as the testing framework. The tests include both **unit tests** and **end-to-end (e2e) tests** to ensure the application behaves as expected.

### Unit Tests:

- Validate individual modules, services, and controllers without involving external systems (e.g., database).
- Mock dependencies to isolate the functionality under test.

### End-to-End (e2e) Tests:

- Test the complete flow of the application, including HTTP requests and database interactions.
- Ensure the APIs function correctly when used as a whole.

---

## Run test scripts

To streamline development and testing workflows, the test includes the following Yarn scripts:

```json
"scripts": {
  "test:express": "cd express && yarn test",
  "test:nest": "cd nest && yarn test",
  "bootstrap": "cd express && yarn && cd ../nest && yarn"
}
```

### Explanation:

- `test:express`: Navigate to the Express.js project directory and run its tests.
- `test:nest`: Navigate to the NestJS project directory and run its tests.
- `bootstrap`: Install dependencies for both the Express.js and NestJS projects.

---

## GitHub Actions for CI

The project includes a GitHub Actions pipeline to automate testing whenever a new commit is pushed. This ensures code quality and prevents regressions.

### Pipeline Configuration:

1. Create a `.github/workflows/run-tests.yml` file with the following content:

   ```yaml
       name: 'Run tests'

       on:
       push:
           branches: ['master']
           paths:
           - 'express/**'
           - 'nest/**'
           - '.github/workflows/*'
       pull_request:
           branches:
           - master
           paths:
           - 'express/**'
           - 'nest/**'
           - '.github/workflows/*'

       jobs:
       run-tests:
           runs-on: ubuntu-latest
           steps:
           - name: Checkout
               uses: actions/checkout@v4

           - name: Setup node
               uses: actions/setup-node@v3
               with:
               node-version: 20.15.1

           - run: corepack enable

           - name: Install deps
               run: yarn run bootstrap

           - name: Run test express
               run: yarn run test:express

           - name: Run test nest
               run: yarn run test:nest

   ```

### Features:

- Automatically runs unit and e2e tests on every push or pull request to the `master` branch.

---

## Conclusion

Both versions of the project, **Express.js** and **NestJS**, provide similar functionality with different database systems (MongoDB vs. PostgreSQL) and follow different programming paradigms (Functional Programming vs. Object-Oriented Programming). The choice between these two approaches depends on your specific use case and preferred software architecture.

Both projects are designed to be easy to run locally, with Yarn used as the package manager for managing dependencies. Additionally, comprehensive testing and CI pipelines ensure code reliability and maintainability.
