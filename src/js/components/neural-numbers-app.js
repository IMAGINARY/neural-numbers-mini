/* globals IMAGINARY */

export default class NeuralNumbersApp {
  constructor(container, config) {
    this.trainingPanelOpen = true;
    this.config = config;

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

    $('<h2>')
      .addClass('training-title')
      .html(this.i18nSideBySideElements('training-title-i18n', 'trainingTitle'))
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
        modelPath: config.model,
        inputPlaceholder: this.i18nSideBySideElements('placeholder-i18n', 'inputPlaceholder'),
        showBars: true,
        showNormalizer: false,
        showTraining: false,
        showOutput: true,
        verticalBars: true,
      }
    );

    this.nnTrainingComponent = new IMAGINARY.NeuralNumbersTraining(
      this.nnComponent,
      this.$nnTrainingUIContainer,
      {
        trainingImagePath: config.trainingImagePath,
        trainingLabelPath: config.trainingLabelPath,
        imageCountLabelText: this.i18nSideBySideElements('image-count-label-i18n', 'imageCountLabelText'),
        predictedAccuracyLabelText: this.i18nSideBySideElements('predicted-accuracy-label-i18n', 'predictedAccuracyLabelText'),
      }
    );
  }

  async init() {
    await this.nnComponent.init();
    await this.nnTrainingComponent.init();

    this.closeTrainingPanel(false);
  }

  i18nSideBySideElements(classname, stringID) {
    return this.config.sideBySideTranslation.map((lang, idx) => (
      `<div class='${classname} i18n-lang-${lang}${idx === 0 ? ' i18n-lang-primary' : ''}'>${this.config?.[stringID]?.[lang] ?? ''}</div>`
    )).join('');
  }

  closeTrainingPanel(animated = true) {
    if (this.trainingPanelOpen) {
      this.nnTrainingComponent.trainingController.pause();

      if (!animated) {
        // Temporarily disable CSS transitions
        this.$trainingPanel.addClass('no-transition');
        this.$element.addClass('no-transition');
      }
      // Add a negative bottom margin to #training-panel so that #training-panel-separator
      // is at the bottom edge of the screen
      const offset = this.$trainingPanel.outerHeight()
        - this.$trainingPanelSeparator.position().top;
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
  }

  openTrainingPanel() {
    if (!this.trainingPanelOpen) {
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
}
