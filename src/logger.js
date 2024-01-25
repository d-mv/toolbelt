function d(m) {
  if (m === null || m === undefined) return m;

  let result = m;

  if (typeof result === 'string') {
    try {
      result = JSON.parse(result);
    } catch (e) {
      // eslint-disable-next-line no-console -- required
      console.error('Error parsing message', m);
    }
  }

  return result;
}

function logMessage(detail) {
  const m = d(detail);

  if (m.area) {
    const { area, ...data } = m;

    if (Object.keys(data).length === 1 && data.message) {
      // eslint-disable-next-line no-console -- required
      console.log(area, '>>', data.message);
    }
    // eslint-disable-next-line no-console -- required
    else console.log(area, '>>', data);
  }
}

function logger(enable = true) {
  if (enable) {
    globalThis.document.addEventListener('log', data => logMessage(data.detail));
    globalThis.console.log('Logging enabled');
  } else {
    globalThis.document.removeEventListener('log', data => logMessage(data.detail));
    // eslint-disable-next-line no-console -- required
    console.log('Logging disabled');
  }
}

globalThis.window.logger = logger;
globalThis.window.logger();
