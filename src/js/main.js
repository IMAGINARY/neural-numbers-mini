const config = require('../../config.json');
const showFatalError = require('./lib/show-fatal-error');

let trainingPanelOpen = false;

try {
  $('.training-title').html(`<div class='training-title-i18n de'>${config.trainingTitle.de}</div><div class='training-title-i18n en'>${config.trainingTitle.en}</div>`)

  const nnComponent = new IMAGINARY.NeuralNumbers(
    $('#neural-numbers-container'),
    {
      modelPath: config.model,
      inputPlaceholder: `<div class='placeholder-i18n de'>${config.inputPlaceholder.de}</div><div class='placeholder-i18n en'>${config.inputPlaceholder.en}</div>`,
      showBars: true,
      showNormalizer: false,
      showTraining: false,
      showOutput: true,
      verticalBars: true,
    });

  const nnTrainingComponent = new IMAGINARY.NeuralNumbersTraining(
    nnComponent,
    $('#neural-numbers-training-ui-container'),
    {
      trainingImagePath: config.trainingImagePath,
      trainingLabelPath: config.trainingLabelPath,
      imageCountLabelText: `<div class='image-count-label-i18n de'>${config.imageCountLabelText.de}</div><div class='image-count-label-i18n en'>${config.imageCountLabelText.en}</div>`,
      predictedAccuracyLabelText: `<div class='predicted-accuracy-label-i18n de'>${config.predictedAccuracyLabelText.de}</div><div class='predicted-accuracy-label-i18n en'>${config.predictedAccuracyLabelText.en}</div>`,
    }
  );

  function closeTrainingPanel(animated = true) {
    if (!animated) {
      // Temporarily disable CSS transitions
      $('#training-panel').addClass('no-transition');
      $('#neural-numbers-container').addClass('no-transition');
    }
    // Add a negative bottom margin to #training-panel so that #training-panel-separator
    // is at the bottom edge of the screen
    const offset = $('#training-panel').outerHeight() - $('#training-panel-separator').position().top;
    $('#training-panel').css('margin-bottom', -offset);
    $('#training-panel').addClass('closed');
    trainingPanelOpen = false;

    const margin = (
      $(window).height()
      - $('#neural-numbers-container').outerHeight()
      - $('#training-panel-separator').position().top
    ) / 2;
    $('#neural-numbers-container').css('margin-top', margin);

    nnTrainingComponent.trainingController.useDefaultModel();

    if (!animated) {
      $('#training-panel').removeClass('no-transition');
      $('#neural-numbers-container').removeClass('no-transition');
    }
  }

  function openTrainingPanel() {
    $('#training-panel').css('margin-bottom', 0);
    $('#training-panel').removeClass('closed');
    trainingPanelOpen = true;

    const margin = (
      $(window).height()
      - $('#neural-numbers-container').outerHeight()
      - $('#training-panel').outerHeight()
    ) / 2;
    $('#neural-numbers-container').css('margin-top', margin);

    nnTrainingComponent.trainingController.useTrainableModel();
  }

  (async () => {
    try {
      $('#training-mode-button').on('click', () => {
        if (trainingPanelOpen) {
          closeTrainingPanel();
        } else {
          openTrainingPanel();
        }
      });

      await nnComponent.init();
      await nnTrainingComponent.init();

      closeTrainingPanel(false);

      setTimeout(() => {
        $('body').addClass('loaded');
      }, 500);
    } catch(error) {
      showFatalError('Unexpected error', error);
    }
  })();

} catch(error) {
  showFatalError('Unexpected error', error);
}


