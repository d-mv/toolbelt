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

/**
 * Add an element between each element of an array
 * Taken from https://stackoverflow.com/questions/31879576/what-is-the-most-elegant-way-to-insert-objects-between-array-elements
 * @param {Array} arr - array to interleave
 * @param {T} el - element to add between each element of the array
 * @returns array with the element added between each element of the original array
 */
export function interleave<T>(arr: T[], el: T) {
	return ([] as T[]).concat(...arr.map((n) => [n, el])).slice(0, -1);
}
