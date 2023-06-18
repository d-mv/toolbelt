import { Err, Ok, Result } from '@sniptt/monads/build';

import { as } from './type.tools';

export function parseStr<T>(s: string): Result<T, Error> {
  try {
    const result = eval('(' + s + ')') as T;

    if (result !== null && result !== undefined) return Ok(result);

    return Err(new Error('Unknown result'));
  } catch (err) {
    return Err(as<Error>(err));
  }
}

export function stringify(data: unknown, def?: string): Result<string, Error> {
  try {
    const result = JSON.stringify(data);

    if (result) return Ok(result);

    if (def) return Ok(def);

    return Err(new Error('Unknown result'));
  } catch (err) {
    return Err(as<TypeError>(err));
  }
}

export function capitalize(s: string): string {
  const split = s.split('');

  return `${split[0]?.toUpperCase()}${split.slice(-(split.length - 1)).join('')}`;
}

interface MakePluralOptions {
  customEnding: string;
  customPluralForm: string;
}

export function makePlural(s: string, qty: number, opts?: Partial<MakePluralOptions>): string {
  if (qty === 1) return s;

  if (opts?.customPluralForm) return opts.customPluralForm;

  if (opts?.customEnding) return `${s.slice(0, -1)}${opts.customEnding}`;

  return `${s}s`;
}
