import { path } from 'ramda';

type Ok<Payload = never> = { isOK: true; payload: Payload };

type Err<ErrorType = Error> = { isOK: false; message: string; error: ErrorType; code: number };

export type ServerResult<Payload = never, ErrorType = Error> = Ok<Payload> | Err<ErrorType>;

export function positiveResponse<Payload>(payload: Payload): ServerResult<Payload> {
  return { isOK: true, payload };
}

export function negativeResponse(errorOrMessage: string | Error, code: number, message?: string): ServerResult {
  const isMessage = typeof errorOrMessage === 'string';

  let m = isMessage ? errorOrMessage : message ?? '';

  if (!isMessage) {
    if (!message && 'message' in errorOrMessage) m = path(['message'], errorOrMessage) ?? '';

    if ('data' in errorOrMessage) m = JSON.stringify(path(['data'], errorOrMessage));
  }

  const error = isMessage ? new Error(m) : errorOrMessage;

  return { isOK: false, message: m, code, error };
}

export type PromisedServerResult<T = void> = Promise<ServerResult<T>>;
