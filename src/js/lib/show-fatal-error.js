function showFatalError(text, error) {
  $('<div></div>')
    .addClass('fatal-error')
    .append($('<div></div>')
      .addClass('fatal-error-text')
      .text(text))
    .append($('<div></div>')
      .addClass('fatal-error-details')
      .text(error.message))
    .append($('<div></div>')
      .addClass('fatal-error-stack')
      .text(error.stack))
    .appendTo('body');

  $('html').addClass('with-fatal-error');
}

export default showFatalError;
