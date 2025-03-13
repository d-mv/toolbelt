export type Some<T> = {
	isNone: false;
	isSome: true;
	unwrapOrElse: (alternative: T) => T;
	unwrap: () => T;
};

export type None = {
	isNone: true;
	isSome: false;
	unwrapOrElse: <K>(alternative: K) => K;
};

export type Option<T> = Some<T> | None;

export function option<T>(data: T | null | undefined): Option<T> {
	if (data === null || data === undefined)
		return {
			isNone: true,
			isSome: false,
			unwrapOrElse: <K>(alternative: K) => alternative,
		};

	return {
		isNone: false,
		isSome: true,
		unwrap: () => data,
		unwrapOrElse: () => data,
	};
}

export function Some<T>(data: T): Some<T> {
	return {
		isNone: false,
		isSome: true,
		unwrap: () => data,
		unwrapOrElse: () => data,
	};
}

export const None: None = {
	isNone: true,
	isSome: false,
	unwrapOrElse: <K>(alternative: K) => alternative,
};

export type Ok<T> = {
	isOk: true;
	isErr: false;
	unwrap: () => T;
	unwrapOrElse: (alternative: T) => T;
};

export type Err<E> = {
	isOk: false;
	isErr: true;
	unwrapOrElse: <K>(alternative: K) => K;
	unwrapErr: () => E;
};

export type Result<T, E> = Ok<T> | Err<E>;

export function Ok<T>(data: T): Ok<T> {
	return {
		isOk: true,
		isErr: false,
		unwrap: () => data,
		unwrapOrElse: () => data,
	};
}

export function Err<E>(err: E): Err<E> {
	return {
		isOk: false,
		isErr: true,
		unwrapOrElse: <K>(alternative: K) => alternative,
		unwrapErr: () => err,
	};
}

export function attempt<T, E = Error>(fn: () => T): Result<T, E> {
	try {
		return Ok(fn());
	} catch (error) {
		return Err(error as E);
	}
}

export async function attemptAsync<T, E = Error>(
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
	isLeft: true;
	isRight: false;
	unwrapLeft: () => L;
	unwrapOrElse: (alternative: L) => L;
};

export type Right<R> = {
	isLeft: false;
	isRight: true;
	unwrap: () => R;
	unwrapOrElse: (alternative: R) => R;
};

export type Either<L, R> = Left<L> | Right<R>;
