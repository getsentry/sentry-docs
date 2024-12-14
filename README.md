<p align="center">
  <a href="https://sentry.io/?utm_source=github&utm_medium=logo" target="_blank">
    <picture>
      <source srcset="https://sentry-brand.storage.googleapis.com/sentry-logo-white.png" media="(prefers-color-scheme: dark)" />
      <source srcset="https://sentry-brand.storage.googleapis.com/sentry-logo-black.png" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)" />
      <img src="https://sentry-brand.storage.googleapis.com/sentry-logo-black.png" alt="Sentry" width="280">
    </picture>
  </a>
</p>

_Bad software is everywhere, and we're tired of it. Sentry is on a mission to help developers write better software faster, so we can get back to enjoying technology. If you want to join us [<kbd>**Check out our open positions**</kbd>](https://sentry.io/careers/)_

# Sentry Documentation

Take a look at our [Contributing to Docs](https://docs.sentry.io/contributing/) documentation to get started.

Note: The documentation for this repository is self-hosted via `src/docs/contributing/`.

This is the Next.js version of our docs.

## Project Overview

Sentry Documentation is a comprehensive resource for developers to understand and utilize Sentry's error tracking and performance monitoring tools. The documentation covers various aspects of Sentry, including setup, configuration, and usage across different platforms and frameworks.

### Main Features

- Detailed guides and tutorials for integrating Sentry with various platforms and frameworks.
- Comprehensive API documentation.
- Best practices for error tracking and performance monitoring.
- Troubleshooting and debugging tips.

## Installation Instructions

To set up the project locally, follow these steps:

1. **Prerequisites**: Ensure you have the following installed:
   - [Node.js](https://nodejs.org/) (version 14 or higher)
   - [Yarn](https://yarnpkg.com/)
   - [Docker](https://www.docker.com/) (for running the local database)

2. **Clone the repository**:
   ```bash
   git clone https://github.com/getsentry/sentry-docs.git
   cd sentry-docs
   ```

3. **Install dependencies**:
   ```bash
   yarn install
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env.development
   ```

5. **Start the local database**:
   ```bash
   docker-compose up -d
   ```

6. **Run database migrations**:
   ```bash
   yarn migrate:dev
   ```

7. **Start the development server**:
   ```bash
   yarn dev
   ```

You can now access the documentation locally at `http://localhost:3000`.

## Usage Examples

Here are some examples to help you understand how to use the project:

### Example 1: Running the Development Server

To run the development server, use the following command:
```bash
yarn dev
```
This will start the server and you can access the documentation at `http://localhost:3000`.

### Example 2: Building the Project

To build the project for production, use the following command:
```bash
yarn build
```
This will create an optimized production build of the documentation.

## Contributing

We welcome contributions to improve the Sentry Documentation. To contribute, follow these guidelines:

1. Fork the repository and create a new branch for your changes.
2. Make your changes and ensure they are well-documented.
3. Submit a pull request with a clear description of your changes.

For more detailed information, refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## Available Scripts

Here is a list of available scripts and their descriptions:

- `yarn dev`: Starts the development server.
- `yarn build`: Builds the project for production.
- `yarn start`: Starts the production server.
- `yarn migrate:dev`: Runs database migrations for the development environment.
- `yarn lint`: Runs all linting checks.
- `yarn lint:ts`: Runs TypeScript linting checks.
- `yarn lint:docs`: Runs documentation linting checks.
- `yarn lint:eslint`: Runs ESLint checks.
- `yarn lint:eslint:fix`: Fixes ESLint issues.
- `yarn lint:prettier`: Runs Prettier checks.
- `yarn lint:prettier:fix`: Fixes Prettier issues.
- `yarn lint:fix`: Fixes all linting issues.
- `yarn sidecar`: Runs the Spotlight sidecar.
- `yarn test`: Runs all tests.
- `yarn test:ci`: Runs tests in CI mode.
- `yarn enforce-redirects`: Enforces redirects.

