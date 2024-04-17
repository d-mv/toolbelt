import { isEmpty, isNil } from 'lodash';

import { Fn } from '../types';
import { as } from './type.tools';

export const isNilOrEmpty = (data: unknown): boolean => isNil(data) || isEmpty(data);

export type IfTrueFn<T> = T | Fn<T>;

export function ifTrue<T = undefined, K = T>(
  condition: unknown,
  dataOrFn: IfTrueFn<T>,
  alternative?: IfTrueFn<K>,
): T | K {
  if (condition) {
    if (typeof dataOrFn === 'function') return as<Fn<T>>(dataOrFn)();

    return dataOrFn;
  }

  if (typeof alternative !== 'undefined') {
    if (typeof alternative === 'function') return as<Fn<K>>(alternative)();

    return alternative;
  }

  return as<T>(undefined);
}
