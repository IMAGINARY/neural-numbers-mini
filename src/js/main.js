const config = require('../../config.json');
import showFatalError from './lib/show-fatal-error';
import NeuralNumbersApp from './components/neural-numbers-app';

$('[data-component=neural-numbers-app]').each(async (index, element) => {
  try {
    const app = new NeuralNumbersApp(element, config);
    await app.init();
    setTimeout(() => {
      $('body').addClass('loaded');
    }, 500);
  } catch(error) {
    showFatalError('Unexpected error', error);
  }
});

