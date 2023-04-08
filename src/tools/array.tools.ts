export function randomItemsFromArray<T>(arr: T[], qty: number): T[] {
  const result: T[] = [];

  for (let i = 0; i < qty; i++) {
    const idx = Math.floor(Math.random() * arr.length);

    result.push(arr[idx] as T);
  }

  return result;
}

/**
 * Build array with the results of calling a provided function
 * @param length desired length of the array
 * @param fn function to call for each element
 * @returns array with the results of calling a provided function
 */
export function buildArrayWith<T>(length: number, fn: () => T): T[] {
  const result: T[] = [];

  for (let i = 0; i < length; i++) {
    result.push(fn());
  }

  return result;
}
