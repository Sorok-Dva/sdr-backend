import { nodeProfilingIntegration } from '@sentry/profiling-node'
import * as Sentry from '@sentry/node'
import dotenv from 'dotenv'

dotenv.config()

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    debug: false,
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  })
}
