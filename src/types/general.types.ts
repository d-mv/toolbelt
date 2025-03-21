// biome-ignore lint/suspicious/noExplicitAny: only place where `any` is allowed
export type AnyValue = any;

export type RecordObject<T = unknown> = Record<string, T>;

export type Optional<T = never> = T | undefined | null;

export type PromisedVoid = Promise<void>;

export type Fn<Return = void> = () => Return;

export type SingletonFn<Argument = unknown, Return = void> = (
	arg0: Argument,
) => Return;
