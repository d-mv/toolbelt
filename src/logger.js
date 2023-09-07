/* eslint-disable no-console */
function decodeMessage(m) {
  if (m === null || m === undefined) return m;

  let result = m;

  if (typeof result === 'string') {
    try {
      result = JSON.parse(result);
    } catch (e) {
      // ignore
    }
  }

  if (typeof result === 'object') {
    const r = {};

    for (const [key, value] of Object.entries(result)) {
      r[key] = decodeMessage(value);
    }

    result = r;
  }

  return result;
}

const LOG = new Proxy(
  {
    metrics: message => {
      console.groupCollapsed(
        `%cMETRICS::${message.name}`,
        'background-color:#cce8f9;color:#444;padding:2px 8px;border-radius: 1px;',
      );
      console.log(message);
      console.groupEnd();
    },
    api: message => {
      console.groupCollapsed(
        `%cAPI::${message.origin}`,
        'background-color:#cce8f9;color:#444;padding:2px 8px;border-radius: 1px;',
      );
      console.log(message);
      console.groupEnd();
    },
    info: message => {
      console.log(`%cINFO::${message}`, 'background-color:#59fe454f;color:#444;padding:2px 8px;border-radius: 1px;');
    },
    error: message => {
      console.log(
        `%cERROR::${typeof message === 'string' ? message : JSON.stringify(message)}`,
        'background-color:#e80000;color:#fff;padding:2px 8px;border-radius: 1px;',
      );
    },
    state_change: ({ stateName, currVal, newVal }) => {
      console.groupCollapsed(
        `%cSTATE_CHANGE::${stateName}`,
        'background-color:#243aa838;color:#243aa8;padding:2px 8px;border-radius: 1px;',
      );
      console.log('CURRENT:', currVal);
      console.log('NEW:', newVal);
      console.groupEnd();
    },
  },
  {
    get: (target, prop) => {
      if (prop in target) return target[prop];

      return message => console.log(message);
    },
  },
);

function logMessage(detail) {
  const { type, message } = decodeMessage(detail);

  LOG[type](message);
}

function logger(enable = true) {
  if (enable) {
    globalThis.document.addEventListener('log', data => logMessage(data.detail));
    globalThis.console.log('Logging enabled');
  } else {
    globalThis.document.removeEventListener('log', data => logMessage(data.detail));
    console.log('Logging disabled');
  }
}

globalThis.window.logger = logger;
globalThis.window.logger();
