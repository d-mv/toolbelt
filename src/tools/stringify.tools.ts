import serializeJavascript from 'serialize-javascript';
import { option, Option, OptionCallbacks } from './option.tools';

/**
 * Safely stringify data
 *
 * @example
 * ```typescript
 * const result = stringify(new Date())
 *
 * dir(result)
 *
 * const negativeResult = stringify('qwerty')
 *
 * dir(negativeResult.isNone && negativeResult.error.message) // get error message
 * dir(negativeResult.isNone && negativeResult.error.cause) // get cause of error
 *
 * stringify(new Date(), {
 *   Some: (v) => log(v),
 *   None: () => log('Error occurred'),
 * })
 *
 * stringify([], {
 *   Some: (v) => log(v),
 *  None: (e) => log('Error occurred:', e?.message),
 * })
 * ```
 */
export function stringify(data: unknown): Option<string>;

export function stringify(data: unknown, callbacks: OptionCallbacks<string>): void;

export function stringify(data: unknown, callbacks?: OptionCallbacks<string>): Option<string> | void {
  const withCallbacks =
    callbacks && 'Some' in callbacks && 'None' in callbacks && (callbacks as OptionCallbacks<string>);

  if (!data) {
    const error = new Error('Missing data');

    if (withCallbacks) withCallbacks.None(error);
    else return option(null, error);
  }

  try {
    // TODO: make options dynamic
    const result = serializeJavascript(data, { isJSON: true });

    if (withCallbacks) {
      if (result) withCallbacks.Some(result);
      else withCallbacks.None(new Error('Unknown result'));
    } else {
      if (result) return option(result);

      return option(null, new Error('Unknown result'));
    }
  } catch (err) {
    const error = new Error('Unable to stringify the argument', { cause: err as Error });

    if (withCallbacks) withCallbacks.None(error);
    else return option(null, error);
  }
}
