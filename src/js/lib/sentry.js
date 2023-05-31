const config = require('../../../config.json');
import * as Sentry from '@sentry/browser';
import { CaptureConsole as CaptureConsoleIntegration } from "@sentry/integrations";

// Search for the sentry-dsn key in the Query String
const urlParams = new URLSearchParams(window.location.search);

const sentryDSN = urlParams.get('sentry-dsn') || config.sentryDSN || process.env.SENTRY_DSN;

if (sentryDSN) {
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
