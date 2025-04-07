import * as Sentry from '@sentry/nextjs';
import {PrismaInstrumentation} from '@prisma/instrumentation';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
  environment: process.env.NODE_ENV,
  integrations: [
    Sentry.prismaIntegration({
      prismaInstrumentation: new PrismaInstrumentation(),
    }),
  ],
  spotlight: process.env.NODE_ENV === 'development',
});
