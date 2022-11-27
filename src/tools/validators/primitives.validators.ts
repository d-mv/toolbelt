import { path } from 'ramda';

import { AnyValue } from '../../types';

export const isStr = (v: unknown) => typeof v === 'string';

export const isNum = (v: unknown) => typeof v === 'number';

export const isReactElement = (obj: AnyValue): boolean => String(path(['$$typeof'], obj)) === 'Symbol(react.element)';
