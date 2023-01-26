import { option, Option, OptionCallbacks } from './option.tools';
import { AnyValue } from '../types';

/**
 * Safely parse string to object
 *
 * @example
 * ```typescript
 * const { dir } = console
 *
 * const result = parseStr<Date>(serializeJavascript(new Date()))
 *
 * dir(result)
 *
 * const negativeResult = parseStr('qwerty')
 *
 * dir(negativeResult.isNone && negativeResult.error.message) // get error message
 * dir(negativeResult.isNone && negativeResult.error.cause) // get cause of error
 *
 * // use callbacks
 * parseStr<Date>(serializeJavascript(new Date()), {
 *   Some: (v) => log(v),
 *   None: () => log('Error occurred'),
 * })
 *
 * parseStr('qwerty', {
 *   Some: (v) => log(v),
 *   None: (e) => log('Error occurred:', e?.message),
 * })
 * ```
 */
export function parseStr<T>(s: string): Option<T>;

export function parseStr<T>(s: string, callbacks: OptionCallbacks<T>): void;

export function parseStr<T>(s: string, callbacks?: OptionCallbacks<T>): Option<T> | void {
  const withCallbacks = callbacks && 'Some' in callbacks && 'None' in callbacks && (callbacks as OptionCallbacks<T>);

  if (!s) {
    if (withCallbacks) withCallbacks.None(new Error('Empty string'));
    else return option(null, new Error('Empty string'));
  }

  try {
    const result = eval('(' + s + ')') as T;

    if (withCallbacks) {
      if (result) withCallbacks.Some(result);
      else withCallbacks.None(new Error('Unknown result'));
    } else {
      if (result) return option(result);

      return option(null, new Error('Unknown result'));
    }
  } catch (err) {
    const error = new Error('Unable to parse the argument', { cause: err as Error });

    if (withCallbacks) withCallbacks.None(error);
    else return option(null, error);
  }
}

export function parseFl(num: AnyValue): Option<number> {
  if (typeof num === 'number') return option(num);

  if (typeof num !== 'string') return option(null, new Error('Unable to parse'));

  try {
    const result = parseFloat(num);

    if (!isNaN(result)) return option(result);

    return option(null, new Error('Unable to parse'));
  } catch (err) {
    return option(null, new Error('Unable to parse', { cause: err as Error }));
  }
}
