/* eslint-disable no-console */
import eventsLib from 'events';
import { path } from 'ramda';
import { Optional } from '../types';

import { ifTrue } from './logic.tools';
import { sortObjectByKey } from './object.tools';

export enum LogEventTypes {
  ERR = 'error',
  INFO = 'info',
  INFO_B = 'info_b',
  METRICS = 'metrics',
  WARN = 'warning',
  DIR = 'dir', // for nodejs
  WRITE = 'write', // for nodejs
  LOG = 'log',
}

export type LogDetail = { type: LogEventTypes | string; message: unknown };

class EventsClass {
  isWeb = false;

  eventEmitter: Optional<eventsLib>;

  constructor() {
    if (globalThis.window) this.isWeb = true;

    if (!this.isWeb) {
      this.eventEmitter = new eventsLib.EventEmitter();
      this.#subscribeToNodeJsEvents();
    }
  }

  #subscribeToNodeJsEvents() {
    this.eventEmitter?.on('log', function logPrinter(...data: unknown[]) {
      console.log(...JSON.stringify(data));
    });

    this.eventEmitter?.on(LogEventTypes.METRICS, function logInfoPrinter(message: string) {
      console.log(`[ metrics ] ${JSON.parse(message).join(';')}`);
    });

    this.eventEmitter?.on(LogEventTypes.INFO, function logInfoPrinter(message: string) {
      console.log(`[ info ] ${JSON.parse(message).join('. ')}`);
    });

    this.eventEmitter?.on(LogEventTypes.INFO_B, function logInfoPrinter(message: string) {
      console.log(`[ info ] ${JSON.parse(message).join('. ')}`);
    });

    this.eventEmitter?.on(LogEventTypes.WARN, function logWarnPrinter(message: string) {
      console.log(`[ warn ] ${JSON.parse(message).join('. ')}`);
    });

    this.eventEmitter?.on(LogEventTypes.DIR, function logDirPrinter(data: unknown) {
      console.dir(data, { depth: 15 });
    });

    this.eventEmitter?.on(LogEventTypes.ERR, function logErrorPrint(payload: { error: Error; message: string }) {
      const { error, message } = payload;

      process.stdout.write('\n');
      ifTrue(message, console.log(`[ error ] ${message || ''}`));
      console.dir(error);
    });

    this.eventEmitter?.on(
      LogEventTypes.WRITE,
      function logWritePrinter({ message, eol = false }: { message: string; eol?: boolean }) {
        process.stdout.write(`${message}${eol ? '\n' : ''}`);
      },
    );
  }

  webEvent(detail: LogDetail) {
    const event = new CustomEvent('log', { detail: JSON.stringify(sortObjectByKey(detail)) });

    document.dispatchEvent(event);
  }

  nodeEvent(detail: LogDetail) {
    this.eventEmitter?.emit(detail.type, detail.message);
  }

  send(detail: LogDetail) {
    if (this.isWeb) this.webEvent(detail);
    else this.nodeEvent(detail);
  }
}

export const Events = new EventsClass();

function log(...data: unknown[]) {
  Events.send({ type: LogEventTypes.LOG, message: data });
}

function dir(data: unknown) {
  Events.send({ type: LogEventTypes.DIR, message: data });
}

function write(message: string, eol = false) {
  if (!Events.isWeb) Events.send({ type: LogEventTypes.WRITE, message: { message, eol } });
}

function logMetrics(...data: (string | number)[]) {
  Events.send({ type: LogEventTypes.METRICS, message: JSON.stringify(data) });
}

function logError(error: unknown, message?: string) {
  let messageToSend = 'Unknown error';

  if (typeof error === 'string') messageToSend = error;
  else if (message) messageToSend = message;
  else if (error && typeof error === 'object') {
    const m = path(['message'], error);

    if (m) messageToSend = String(m);
  }

  Events.isWeb
    ? Events.send({ type: LogEventTypes.ERR, message: messageToSend })
    : Events.send({ type: LogEventTypes.ERR, message: { error, message: messageToSend } });
}

function logInfo(...data: (string | number)[]) {
  Events.send({ type: LogEventTypes.INFO, message: JSON.stringify(data) });
}

function logInfoB(...data: (string | number)[]) {
  Events.send({ type: LogEventTypes.INFO_B, message: JSON.stringify(data) });
}

function logWarn(...data: unknown[]) {
  Events.send({ type: LogEventTypes.WARN, message: JSON.stringify(data) });
}

const logger = { warn: logWarn, info: logInfo, infoB: logInfoB, error: logError, log, write, metrics: logMetrics, dir };

export { logger };
