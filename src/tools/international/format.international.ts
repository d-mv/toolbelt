import { parseFl } from '../parse.tools';
import { isStr, isNum } from '../validators';

// 1,234,567.00
export const toFin = new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }).format;

export function formatNum(options?: Partial<Intl.NumberFormatOptions & { suffix: string }>) {
  const format = Intl.NumberFormat('en-US', {
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format;

  return function formatter(target: string | number): string {
    if (target === 0 || target === '0') return format(0.0);

    const isString = isStr(target);

    const isNumber = isNum(target);

    if ((!isString && !isNumber) || (isNumber && isNaN(target as number))) return format(0.0);

    let value: number = (target as number) ?? 0;

    if (isString) {
      const result = parseFl(value);

      if (result.isNone) return format(0.0);

      value = result.value;
    }

    return format(value) + (options?.suffix || '');
  };
}

export function asCurrency(options?: Partial<Intl.NumberFormatOptions>) {
  const format = Intl.NumberFormat('en-US', {
    style: 'currency',
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currency: 'USD',
    ...options,
  }).format;

  return function formatter(target: number | string): string {
    const isNumber = isNum(target);

    const isString = isStr(target);

    if ((!isNumber && !isString) || (isNumber && isNaN(target as number))) return '';

    let value = target as number;

    if (isString) {
      const result = parseFl(value);

      if (result.isNone) return '';

      value = result.value;
    }

    return format(value);
  };
}
