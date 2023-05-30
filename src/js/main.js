const config = require('../../config.json');
(async () => {

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
  await nnComponent.init();
  await nnTrainingComponent.init();
})();
