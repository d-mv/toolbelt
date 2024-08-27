function d(m) {
  if (m === null || m === undefined) return m;

  let result = m;

  if (typeof result === 'string') {
    try {
      result = JSON.parse(result);
    } catch (e) {
      console.error('Error parsing message', m)
    }
  }

  return result;
}

function logMessage(detail) {
  const m = d(detail);

  const { area, type, ...data } = m;

  let l = console.log;

  if (m.type) l = console[type];

  const message = Object.keys(data).length === 1 && data.message ? data.message : data;

  if (area) l(area, '>>', message)
  else l('>>', message)
}

function logger(enable = true) {
  if (enable) {
    globalThis.document.addEventListener('log', (data) => logMessage(data.detail))
    globalThis.console.log('Logging enabled')
  } else {
    globalThis.document.removeEventListener('log', (data) => logMessage(data.detail))
    // eslint-disable-next-line no-console -- required
    console.log('Logging disabled')
  }
}

globalThis.window.logger = logger;
globalThis.window.logger();
