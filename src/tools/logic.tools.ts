import { isEmpty, isNil } from 'ramda';

import { as } from './type.tools';

export const isNilOrEmpty = (data: unknown): boolean => isNil(data) || isEmpty(data);

export function ifTrue<T = undefined, K = T>(
  condition: unknown,
  dataOrFn: (() => T) | T,
  alternative?: (() => K) | K,
): T | K {
  if (condition) {
    if (typeof dataOrFn === 'function') return (dataOrFn as () => T)();

    return dataOrFn;
  }

  if (typeof alternative !== 'undefined') {
    if (typeof alternative === 'function') return (alternative as () => K)();

    return alternative;
  }

  return as<T>(undefined);
}
