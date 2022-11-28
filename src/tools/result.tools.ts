export type OK<Payload = never> = { isOK: true; isErr: false; payload: Payload; isResult: true };

export type ResultError<E> = { isOK: false; isErr: true; error: E; isResult: true };

export type Err<E extends Error = Error> = ResultError<E>;

export type ErrString = ResultError<string>;

export type Result<Payload = never, E extends Error = Error> = (OK<Payload> | Err<E>) & { isResult: true };

export type ResultErString<Payload = never> = OK<Payload> | ErrString;

export interface ResultCallbacks<P = unknown, E extends Error = Error> {
  OK: (value: P) => void;
  Err: (error: E) => void;
}

export interface ResultErStringCallbacks<P = unknown> {
  OK: (value: P) => void;
  Err: (error: string) => void;
}

export function resultToString<T>(r: Result<T>): ResultErString<T> {
  if (r.isOK) return r;

  return { isOK: false, isErr: true, error: r.error.message, isResult: true };
}

export type PromisedResult<T = void> = Promise<Result<T>>;
