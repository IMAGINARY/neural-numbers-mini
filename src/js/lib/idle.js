// eslint-disable-next-line import/prefer-default-export
export function installIdleHandler(callback, timeout) {

  let idleTimeout = null;
  $(document).on('pointerdown', () => {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(callback, timeout * 1000);
  });
}
