export type Some<Value = unknown> = { isSome: true; isNone: false; value: Value; isOption: true };

export type None = { isSome: false; isNone: true; error: Error; isOption: true };

export type Option<Value = unknown> = None | Some<Value>;

export interface OptionCallbacks<T> {
  Some: (value: T) => void;
  None: (error: Error) => void;
}

export function none(error?: Error): None {
  return { isSome: false, isNone: true, error: error ?? new Error('Unknown error'), isOption: true };
}

export function some<T>(value: T): Some<T> {
  return { isSome: true, isNone: false, value, isOption: true };
}

export function option<Value = unknown>(value: unknown, error?: Error): Option<Value> {
  if (value === null || value === undefined) return none(error);

  return some(value as Value);
}
