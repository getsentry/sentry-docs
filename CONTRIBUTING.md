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
