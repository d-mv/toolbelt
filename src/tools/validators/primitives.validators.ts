import { path } from 'lodash/fp';

import { AnyValue } from '../../types';

export const isStr = (v: unknown) => typeof v === 'string';

export const isNum = (v: unknown) => typeof v === 'number';

export const isFn = (f: unknown) => typeof f === 'function';

export const isReactElement = (obj: AnyValue): boolean => String(path(['$$typeof'], obj)) === 'Symbol(react.element)';
