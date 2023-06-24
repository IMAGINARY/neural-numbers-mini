const config = require('../../config.json');
import showFatalError from './lib/show-fatal-error';
import NeuralNumbersApp from './components/neural-numbers-app';
import { initSentry } from './lib/sentry';
import { installIdleHandler } from './lib/idle';

const urlParams = new URLSearchParams(window.location.search);
const sentryDSN = urlParams.get('sentry-dsn') || config.sentryDSN || process.env.SENTRY_DSN;

if(sentryDSN) {
  initSentry(sentryDSN);
}

$('[data-component=neural-numbers-app]').each(async (index, element) => {
  try {
    const app = new NeuralNumbersApp(element, config);
    await app.init();
    setTimeout(() => {
      $('body').addClass('loaded');
    }, 500);

    const idleTimeout = Number(urlParams.get('idle-timeout') || config.idleTimeout || process.env.IDLE_TIMEOUT || 60);
    if (idleTimeout) {
      installIdleHandler(() => {
        app.closeTrainingPanel();
      }, idleTimeout);
    }
  } catch(error) {
    showFatalError('Unexpected error', error);
    // Throw it again to make sure it gets logged to Sentry
    throw error;
  }
});

