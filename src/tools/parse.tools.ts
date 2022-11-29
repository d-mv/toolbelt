// import { Readable } from 'stream';
// import { parse } from 'fast-csv';
import PhoneNumberFormatter from 'phone-number-formats';

import { option, Option, OptionCallbacks } from './option.tools';
import { AnyValue } from '../types';
import { isStr } from './validators';

// type ReturnT<P> = P | string;

// export async function parseCsvBuffer<CsvStructure extends Record<string, string>>(
//   file: Buffer,
// ): Promise<Option<CsvStructure[]>>;

// export async function parseCsvBuffer<CsvStructure extends Record<string, string>>(
//   file: Buffer,
//   key: keyof CsvStructure,
// ): Promise<Option<string[]>>;

// export async function parseCsvBuffer<CsvStructure extends Record<string, string>>(
//   file: Buffer,
//   key?: keyof CsvStructure,
// ): Promise<Option<ReturnT<CsvStructure>[]>> {
//   try {
//     const parsingUnresolvedPromise = new Promise<ReturnT<CsvStructure>[]>((resolve, reject) => {
//       const items: ReturnT<CsvStructure>[] = [];

//       Readable.from(file)
//         .pipe(parse<string[], number[]>({ headers: true }))
//         .on('error', error => reject(error))
//         .on('data', (data: CsvStructure) => {
//           if (key) {
//             const value = data[key];

//             if (!value) reject(new Error(`Column was not found: ${String(key)}`));

//             items.push(value);
//           } else items.push(data);
//         })
//         .on('end', () => {
//           resolve(items);
//         });
//     });

//     const requestedColumn = await parsingUnresolvedPromise;

//     return option(requestedColumn);
//   } catch (err) {
//     return option(null, err as Error);
//   }
// }

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

export function toPhone(value: unknown): Option<string> {
  if (!value || !isStr(value)) return option(null, new Error('Value is empty or not a string'));

  const v = String(value).trim();

  const isInternational = v[0] === '+';

  try {
    let result = new PhoneNumberFormatter(v).format({ type: 'international' }).string ?? '';

    if (!isInternational) result = result.replace('+', '');

    return option(result);
  } catch (err) {
    return option(null, new Error('Unable to parse', { cause: err as Error }));
  }
}
