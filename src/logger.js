function parseJson(message) {
  try {
    if (typeof message === 'string') return JSON.parse(message);

    return message;
  } catch {
    return message;
  }
}

function splitJoin(message) {
  const split = message.split(';');

  if (split.length < 2) return message;

  return split.join(' | ');
}

function parseMessage(message) {
  let maybeJson = parseJson(message);

  if (Array.isArray(maybeJson)) return maybeJson.map(splitJoin).join(' | ');

  if (typeof maybeJson === 'object') return message;

  return splitJoin(message);
}

function stateUpdate(message) {
  const { groupCollapsed, groupEnd, log, info } = console;

  const [, state, action, nextState] = message;

  groupCollapsed('%c[ACTION]', 'background-color: lemonchiffon;padding: 2px 8px', action.type);
  log('%c[previous state]', 'color:green', state);
  info('%c[action]', 'color:blue;font-style: italic', action);
  log('%c[next state]', 'color:green', nextState);
  groupEnd();
}

function decodeMessage(detail) {
  let d = detail;

  if (typeof d === 'string') d = JSON.parse(detail);

  let message = d.message;

  if (typeof message === 'string') message = parseMessage(d.message);

  return { type: d.type, message };
}

const LOGGER = {
  // eslint-disable-next-line no-console
  log: message => console.log(message),
  dir: message => {
    if (message[0] === 'state updated') stateUpdate(message);
    // eslint-disable-next-line no-console
    else console.dir(message);
  },
  info_b: message =>
    // eslint-disable-next-line no-console
    console.log(`%c[INFO] ${message}`, 'background-color:#d7e464;color:#444;padding:3px 8px;border-radius: 3px;'),
  info: message =>
    // eslint-disable-next-line no-console
    console.log(`%c[INFO] ${message}`, 'background-color:#d7e464;color:#444;padding:3px 8px;border-radius: 3px;'),
  metrics: message =>
    // eslint-disable-next-line no-console
    console.log(`%c[METRICS] ${message}`, 'background-color:#cce8f9;color:#444;padding:3px 8px;border-radius: 3px;'),
  warning: message =>
    // eslint-disable-next-line no-console
    console.log(`%c[WARN] ${message}`, 'background-color:#fec67c;color:#444;padding:3px 8px;border-radius: 3px;'),
  error: message => {
    if (typeof message === 'object') {
      let mess = 'message' in message ? ' ' + message['message'] : '';

      if ('traceId' in message) mess = mess + ' ' + message['traceId'];

      // eslint-disable-next-line no-console
      console.log(
        `%c[ERROR]${mess}`,
        'background-color:#e5130e;color:#444;padding:3px 8px;border-radius: 3px;',
        message,
      );
    }
    // eslint-disable-next-line no-console
    else console.log(`%c[ERROR] ${message}`, 'background-color:#e5130e;color:#444;padding:3px 8px;border-radius: 3px;');
  },
};

function logMessage(detail) {
  let { type, message } = decodeMessage(detail);
  // eslint-disable-next-line security/detect-object-injection
  LOGGER[type](message);
}

function logger(enable = true) {
  if (enable) {
    globalThis.document.addEventListener('log', data => logMessage(data.detail));
    globalThis.console.log('Logging enabled');
  } else {
    globalThis.document.removeEventListener('log', data => logMessage(data.detail));
    // eslint-disable-next-line no-console
    console.log('Logging disabled');
  }
}

globalThis.window['logger'] = logger;
globalThis.window.logger();
