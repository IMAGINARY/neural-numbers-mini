import * as Sentry from '@sentry/browser';
import { CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations';

// eslint-disable-next-line import/prefer-default-export
export function initSentry(sentryDSN) {
  Sentry.init({
    dsn: sentryDSN,
    release: process.env.GIT_COMMIT_HASH,
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    integrations: [new CaptureConsoleIntegration({
      // array of methods that should be captured
      // defaults to ['log', 'info', 'warn', 'error', 'debug', 'assert']
      levels: ['error'],
    })],
  })
}
