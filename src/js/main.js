const config = require('../../config.json');
$('[data-component=neural-numbers-container]').each(async (i, element) => {
  const component = new IMAGINARY.NeuralNumbers(element, {
    modelPath: config.model,
    inputPlaceholder: `<div class='placeholder-i18n de'>${config.inputPlaceholder_de}</div><div class='placeholder-i18n en'>${config.inputPlaceholder_en}</div>`,
    showBars: true,
    showNormalizer: false,
    showTraining: false,
    showOutput: true,
  });
  await component.init();
});
