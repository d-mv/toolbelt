import { path, pick } from 'ramda';

export type Ok<Payload = never> = { isOK: true; payload: Payload };

export type Err<ErrorType = Error> = { isOK: false; message: string; error: ErrorType };

export type Result<Payload = never, ErrorType = Error> = Ok<Payload> | Err<ErrorType>;

export type ResultWithoutError<Payload = never, ErrorType = Error> = Ok<Payload> | Omit<Err<ErrorType>, 'error'>;

export function success<Payload>(payload: Payload): Result<Payload> {
  return { isOK: true, payload };
}

export function failure(errorOrMessage: string | Error, message?: string): Result {
  const isMessage = typeof errorOrMessage === 'string';

  let m = isMessage ? errorOrMessage : message ?? '';

  if (!isMessage) {
    if (!message && 'message' in errorOrMessage) m = path(['message'], errorOrMessage) ?? '';

    if ('data' in errorOrMessage) m = JSON.stringify(path(['data'], errorOrMessage));
  }

  const error = isMessage ? new Error(m) : errorOrMessage;

  return { isOK: false, message: m, error };
}

export function stripError(r: Result): Result | ResultWithoutError {
  if (r.isOK) return r;

  return pick(['isOK', 'message'], r);
}

export type PromisedResult<T = void> = Promise<Result<T>>;
