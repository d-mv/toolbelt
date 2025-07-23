export type Some<T> = {
	readonly _tag: "Some";
	isNone(): this is never;
	isSome(): this is Some<T>;
	unwrapOrElse(): T;
	unwrap(): T;
};

export type None = {
	readonly _tag: "None";
	isNone(): this is None;
	isSome(): this is never;
	unwrapOrElse<K>(alternative: K): K;
};

export type Option<T> = Some<T> | None;

export function option<T>(data: T | null | undefined): Option<T> {
	if (data === null || data === undefined)
		return {
			_tag: "None" as const,
			isNone(): this is None {
				return true;
			},
			isSome(): this is never {
				return false;
			},
			unwrapOrElse: <K>(alternative: K) => alternative,
		};

	return {
		_tag: "Some" as const,
		isNone(): this is never {
			return false;
		},
		isSome(): this is Some<T> {
			return true;
		},
		unwrap: () => data,
		unwrapOrElse: () => data,
	};
}

export function Some<T>(data: T): Some<T> {
	return {
		_tag: "Some" as const,
		isNone(): this is never {
			return false;
		},
		isSome(): this is Some<T> {
			return true;
		},
		unwrap: () => data,
		unwrapOrElse: () => data,
	};
}

export const None: None = {
	_tag: "None" as const,
	isNone(): this is None {
		return true;
	},
	isSome(): this is never {
		return false;
	},
	unwrapOrElse: <K>(alternative: K) => alternative,
};

export type Ok<T> = {
	readonly _tag: "Ok";
	isOk(): this is Ok<T>;
	isErr(): this is never;
	unwrap(): T;
	unwrapOrElse(alternative: T): T;
};

export type Err<E> = {
	readonly _tag: "Err";
	isOk(): this is never;
	isErr(): this is Err<E>;
	unwrapOrElse<K>(alternative: K): K;
	unwrapErr(): E;
};

export type Result<T, E> = Ok<T> | Err<E>;

export function Ok<T>(data: T): Ok<T> {
	return {
		_tag: "Ok" as const,
		isErr(): this is never {
			return false;
		},
		isOk(): this is Ok<T> {
			return true;
		},
		unwrap: () => data,
		unwrapOrElse: () => data,
	};
}

export function Err<E>(err: E): Err<E> {
	return {
		_tag: "Err" as const,
		isErr(): this is Err<E> {
			return true;
		},
		isOk(): this is never {
			return false;
		},
		unwrapErr: () => err,
		unwrapOrElse: <K>(alternative: K) => alternative,
	};
}

export function attemptSync<T, E = Error>(fn: () => T): Result<T, E> {
	try {
		return Ok(fn());
	} catch (error) {
		return Err(error as E);
	}
}

export async function attempt<T, E = Error>(
	fn: () => T,
): Promise<Result<Awaited<T>, E>> {
	try {
		const r = await fn();

		return Ok(r);
	} catch (error) {
		return Err(error as E);
	}
}

export type Left<L> = {
	readonly _tag: "Left";
	isLeft(): this is Left<L>;
	isRight(): this is never;
	unwrapLeft(): L;
	unwrapOrElse(alternative: L): L;
};

export type Right<R> = {
	readonly _tag: "Right";
	isLeft(): this is never;
	isRight(): this is Right<R>;
	unwrap(): R;
	unwrapOrElse(alternative: R): R;
};

export type Either<L, R> = Left<L> | Right<R>;

export function Left<L>(data: L): Left<L> {
	return {
		_tag: "Left" as const,
		isLeft(): this is Left<L> {
			return true;
		},
		isRight(): this is never {
			return false;
		},
		unwrapLeft: () => data,
		unwrapOrElse: () => data,
	};
}

export function Right<R>(data: R): Right<R> {
	return {
		_tag: "Right" as const,
		isLeft(): this is never {
			return false;
		},
		isRight(): this is Right<R> {
			return true;
		},
		unwrap: () => data,
		unwrapOrElse: () => data,
	};
}
