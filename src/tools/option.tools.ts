export type Some<Payload = unknown> = { isSome: true; isNone: false; payload: Payload; isOption: true };

export type None = { isSome: false; isNone: true; error: Error; isOption: true };

export type Option<Payload = unknown> = None | Some<Payload>;

export interface OptionCallbacks<T> {
  Some: (value: T) => void;
  None: (error: Error) => void;
}

export function none(error?: Error): None {
  return { isSome: false, isNone: true, error: error ?? new Error('Unknown error'), isOption: true };
}

export function some<T>(payload: T): Some<T> {
  return { isSome: true, isNone: false, payload, isOption: true };
}

export function option<Payload = unknown>(payload: unknown, error?: Error): Option<Payload> {
  if (payload === null || payload === undefined) return none(error);

  return some(payload as Payload);
}
