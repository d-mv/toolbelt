import { Optional, RecordObject } from '../types';

export function isObject(data: unknown): boolean {
  return Object.getPrototypeOf(data) === Object.getPrototypeOf({});
}

export function arrayTypesCheck(data: unknown[], types: string[]): boolean {
  return data.map(element => types.includes(typeof element)).every(Boolean);
}

export function objectTypesCheck(data: RecordObject<unknown>, types: string[]): boolean {
  return Object.keys(data)
    .map(key => types.includes(typeof data[key]))
    .every(Boolean);
}

export function isObjectOf(data: unknown, types: string[]): boolean {
  if (Object.getPrototypeOf(data) !== Object.getPrototypeOf({})) return false;

  return objectTypesCheck(data as RecordObject<unknown>, types);
}

export function mapI<T, K>(fn: (item: T, index: number) => K, data: Optional<T[]>): K[] {
  if (!data || !Array.isArray(data)) return [];

  const sections = [];

  let i = 0;

  for (const element of data) {
    sections.push(fn(element, i));
    i += 1;
  }

  return sections;
}

export function buildIntArray(to: number, from = 0) {
  if (to <= from) return [];

  const result: number[] = [];

  for (let i = from; i < to + 1; i++) {
    result.push(i);
  }

  return result;
}

export function loop<T, K>(data: Optional<T[]>, fn: (item: T, index: number) => K, filterBool = false): K[] {
  if (!data || !Array.isArray(data)) return [];

  const sections = [];

  let i = 0;

  for (const element of data) {
    const result = fn(element, i);

    if (!filterBool) {
      sections.push(result);
      i += 1;
    } else if (filterBool && result) {
      sections.push(result);
      i += 1;
    }
  }

  return sections;
}

export function sortObjectByKey(obj: unknown) {
  if (!obj || typeof obj !== 'object') return obj;

  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      return { ...acc, [key]: (obj as RecordObject)[key] };
    }, {});
}

export function makeMatch<T = unknown, K = T>(object: RecordObject<T>, defaultReturn: K): RecordObject<T> {
  return new Proxy(object, {
    get(target, prop) {
      return prop in target ? target[prop.toString()] : defaultReturn;
    },
  });
}
