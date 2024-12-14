<p align="center">
  <a href="https://sentry.io/?utm_source=github&utm_medium=logo" target="_blank">
    <img src="https://sentry-brand.storage.googleapis.com/sentry-wordmark-dark-280x84.png" alt="Sentry" width="280" height="84">
  </a>
</p>

## Setting up an Environment

We use Next.js, `yarn` and `volta` to manage the environment.

```
cp .env.example .env.development
yarn
yarn dev
```

With that, the repo is fully set up and you are ready to open local docs under http://localhost:3000

### Database

There is a compose file to start a local postgres db:

```
docker-compose up -d
```

If you already run a local postgres, it will create a `changelog` table.

The inital setup or the clean the database call:

```
yarn migrate:dev
```

To add new entries, visit `/changelog/_admin` you need to have a Google Account in the Sentry org to login.

#### Seeding

Call

```
npx prisma db seed
```

## Contribution Guidelines

We welcome contributions to improve the Sentry Documentation. To contribute, follow these guidelines:

1. Fork the repository and create a new branch for your changes.
2. Make your changes and ensure they are well-documented.
3. Submit a pull request with a clear description of your changes.

### Branching Strategy

We use the GitFlow branching strategy to manage the development process efficiently. Here is a brief overview of the strategy:

- **Main Branch**: The `main` branch contains the production-ready code.
- **Develop Branch**: The `develop` branch contains the latest development changes.
- **Feature Branches**: Feature branches are created from the `develop` branch and are used to develop new features. Once a feature is complete, it is merged back into the `develop` branch.
- **Release Branches**: Release branches are created from the `develop` branch when preparing for a new release. Once the release is ready, it is merged into both the `main` and `develop` branches.
- **Hotfix Branches**: Hotfix branches are created from the `main` branch to fix critical issues in the production code. Once the hotfix is complete, it is merged into both the `main` and `develop` branches.

### Code Style

To maintain a consistent coding style across the project, we use tools like Prettier and ESLint. Please ensure that your code adheres to the following guidelines:

- Run `yarn lint` to check for linting errors.
- Run `yarn lint:eslint:fix` to automatically fix ESLint issues.
- Run `yarn lint:prettier:fix` to automatically fix Prettier issues.

### Testing

To ensure the reliability of the code, we use unit tests and integration tests. Please add tests for any new features or changes you make. Run the following commands to execute the tests:

- `yarn test`: Runs all tests.
- `yarn test:ci`: Runs tests in CI mode.

### Documentation

Please update the documentation to reflect any changes you make. This includes updating the `README.md` file, as well as any relevant documentation files in the `docs` directory.

### Submitting a Pull Request

When submitting a pull request, please ensure that you:

- Provide a clear description of the changes you have made.
- Reference any related issues or pull requests.
- Add any necessary tests and documentation updates.
- Follow the branching strategy and code style guidelines.

Thank you for contributing to the Sentry Documentation!
