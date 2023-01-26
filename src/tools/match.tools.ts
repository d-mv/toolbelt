import { Option, OptionCallbacks } from './option.tools';
import { Result, ResultCallbacks, ResultErString, ResultErStringCallbacks } from './result.tools';
import { isStr } from './validators';

interface M<P, E extends Error, T extends Result<P, E> | ResultErString<P> | Option<P>> {
  get: (
    arg0: T extends Result<P, E>
      ? ResultCallbacks<P, E>
      : T extends ResultErString<P>
      ? ResultErStringCallbacks<P>
      : OptionCallbacks<P>,
  ) => void;
}

class Match<P, E extends Error, T extends Result<P, E> | ResultErString<P> | Option<P>> implements M<P, E, T> {
  #resultOrOption: Result<P, E> | ResultErString<P> | Option<P>;

  constructor(resultOrOption: Result<P, E> | ResultErString<P> | Option<P>) {
    if (!('isResult' in resultOrOption) && !('isOption' in resultOrOption))
      throw new Error('Argument is neither Result nor Option');

    this.#resultOrOption = resultOrOption;
  }

  get(
    callbacks: T extends Result<P, E>
      ? ResultCallbacks<P, E>
      : T extends ResultErString<P>
      ? ResultErStringCallbacks<P>
      : OptionCallbacks<P>,
  ) {
    const r = this.#resultOrOption;

    // result
    if ('isResult' in r) {
      const c = callbacks as ResultCallbacks<P, E>;

      if (r.isOK) c.OK(r.payload);
      else {
        if (isStr(r.error)) (callbacks as ResultErStringCallbacks<P>).Err(r.error as string);
        else c.Err(r.error as E);
      }
      // option
    } else {
      const c = callbacks as OptionCallbacks<P>;

      if (r.isSome) c.Some(r.value);
      else c.None(r.error);
    }
  }
}

/**
 * Use matching for Result (inc. ResultErString) and Option
 * @param {Result|Option} resultOrOption provide Result or Option object
 * @param {Object} callbacks matching set of callbacks
 * @example
 * ```typescript
 * // result
 * matcher(result, {
 * 	OK: (v) => {
 *   console.log('v', v)
 * 	},
 * 	Err: (e) => { // error argument is optional
 *   console.log('e', e)
 * 	},
 * })
 * // option
 * matcher(option, {
 * 	Some: (v) => {
 *   console.log('v', v)
 * 	},
 * 	None: (e) => { // error argument is optional
 *   console.log('e', e)
 * 	},
 * })
 * ```
 */
export function match<P, E extends Error>(resultOrOption: Result<P, E>, callbacks: ResultCallbacks<P, E>): void;

export function match<P>(resultOrOption: ResultErString<P>, callbacks: ResultErStringCallbacks<P>): void;

export function match<P>(resultOrOption: Option<P>, callbacks: OptionCallbacks<P>): void;

export function match<P, E extends Error, T extends Result<P, E> | ResultErString<P> | Option<P>>(
  resultOrOption: Result<P, E> | ResultErString<P> | Option<P>,
  callbacks: T extends Result<P, E>
    ? ResultCallbacks<P, E>
    : T extends ResultErString<P>
    ? ResultErStringCallbacks<P>
    : OptionCallbacks<P>,
): void {
  return new Match<P, E, T>(resultOrOption).get(callbacks);
}
