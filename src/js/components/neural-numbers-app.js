const config = require('../../../config.json');

export default class NeuralNumbersApp {
  constructor(container, props) {
    this.trainingPanelOpen = false;

    this.$element = $('<div>')
      .attr('id', 'neural-numbers-container')
      .appendTo(container);

    this.$trainingPanel = $('<div>')
      .attr('id', 'training-panel')
      .appendTo(this.$element);

    this.$trainingModeButton = $('<button>')
      .attr('id', 'training-mode-button')
      .on('click', () => {
        if (this.trainingPanelOpen) {
          this.closeTrainingPanel();
        } else {
          this.openTrainingPanel();
        }
      })
      .appendTo(this.$trainingPanel);

    this.$trainingTitle = $('<h2>')
      .addClass('training-title')
      .html(`<div class='training-title-i18n de'>${props.trainingTitle.de}</div><div class='training-title-i18n en'>${props.trainingTitle.en}</div>`)
      .appendTo(this.$trainingModeButton);

    this.$trainingPanelSeparator = $('<div>')
      .attr('id', 'training-panel-separator')
      .appendTo(this.$trainingPanel);

    this.$trainingControls = $('<div>')
      .attr('id', 'training-controls')
      .appendTo(this.$trainingPanel);

    this.$nnTrainingUIContainer = $('<div>')
      .attr('id', 'neural-numbers-training-ui-container')
      .appendTo(this.$trainingControls);

    this.nnComponent = new IMAGINARY.NeuralNumbers(
      this.$element,
      {
        modelPath: props.model,
        inputPlaceholder: `<div class='placeholder-i18n de'>${props.inputPlaceholder.de}</div><div class='placeholder-i18n en'>${props.inputPlaceholder.en}</div>`,
        showBars: true,
        showNormalizer: false,
        showTraining: false,
        showOutput: true,
        verticalBars: true,
      });

    this.nnTrainingComponent = new IMAGINARY.NeuralNumbersTraining(
      this.nnComponent,
      this.$nnTrainingUIContainer,
      {
        trainingImagePath: props.trainingImagePath,
        trainingLabelPath: props.trainingLabelPath,
        imageCountLabelText: `<div class='image-count-label-i18n de'>${props.imageCountLabelText.de}</div><div class='image-count-label-i18n en'>${props.imageCountLabelText.en}</div>`,
        predictedAccuracyLabelText: `<div class='predicted-accuracy-label-i18n de'>${props.predictedAccuracyLabelText.de}</div><div class='predicted-accuracy-label-i18n en'>${props.predictedAccuracyLabelText.en}</div>`,
      }
    );
  }

  async init() {
    await this.nnComponent.init();
    await this.nnTrainingComponent.init();

    this.closeTrainingPanel(false);
  }

  closeTrainingPanel(animated = true) {
    if (!animated) {
      // Temporarily disable CSS transitions
      this.$trainingPanel.addClass('no-transition');
      this.$element.addClass('no-transition');
    }
    // Add a negative bottom margin to #training-panel so that #training-panel-separator
    // is at the bottom edge of the screen
    const offset = this.$trainingPanel.outerHeight() - this.$trainingPanelSeparator.position().top;
    this.$trainingPanel.css('margin-bottom', -offset);
    this.$trainingPanel.addClass('closed');
    this.trainingPanelOpen = false;

    const margin = (
      $(window).height()
      - this.$element.outerHeight()
      - this.$trainingPanelSeparator.position().top
    ) / 2;
    this.$element.css('margin-top', margin);

    this.nnTrainingComponent.trainingController.useDefaultModel();

    if (!animated) {
      this.$trainingPanel.removeClass('no-transition');
      this.$element.removeClass('no-transition');
    }
  }

  openTrainingPanel() {
    this.$trainingPanel.css('margin-bottom', 0);
    this.$trainingPanel.removeClass('closed');
    this.trainingPanelOpen = true;

    const margin = (
      $(window).height()
      - this.$element.outerHeight()
      - this.$trainingPanel.outerHeight()
    ) / 2;
    this.$element.css('margin-top', margin);

    this.nnTrainingComponent.trainingController.useTrainableModel();
  }
}
