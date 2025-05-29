import { path, concat, isEmpty, split, toLower } from "ramda";
import { words } from "tiny-case";
import { isObject } from "../tools/object.tools";

type ConfigToSafeOptions = {
	delimiter: string | string[];
	include: string[];
	exclude: string[];
};

const UNSAFE_KEYS = [
	"password",
	"secret",
	"token",
	"key",
	"id",
	"cert",
	"sid",
	"number",
	"phone",
	"email",
	"address",
	"url",
	"uri",
	"ip",
	"ipv4",
	"ipv6",
	"mac",
	"uuid",
	"guid",
	"hash",
	"cipher",
];

function splitString(s: string, delimeter: string | string[]): string[] {
	let preResult = [] as string[];

	if (typeof delimeter === "string") preResult = split(delimeter, s);
	else preResult = delimeter.flatMap((d) => split(s, d));

	return preResult.flatMap(words).map(toLower);
}

function checkIfUnSafe(options?: Partial<ConfigToSafeOptions>) {
	return (key: string) => {
		const unsafeKeys = concat(UNSAFE_KEYS, options?.include || []);

		if (unsafeKeys.includes(key)) return true;

		return false;
	};
}
/**
 * Function to convert a config object to a safe object, replacing values for unsafe keys with [MISSING] or [PRESENT]
 * @param {unknown} [obj] - The config object to be converted
 * @param {object} options - The options object
 * @returns {object} - The safe object
 * @example
 * const config = {
 *  password: '123456',
 *  secret: undefined,
 *  token: 'sampleToken',
 *  key: 'sampleKey',
 *  patient_id: 1,
 *  patient_name_id: 'John Doe',
 *  clientId: 25,
 *  clientName: 'Jane Doe'
 * }
 * const safeConfig = safeObject(config,{
 *    include: ['patient_name_id'],
 *    exclude: ['clientName']
 * });
 * console.log(safeConfig);
 * // Output:
 * // {
 * //   password: '[PRESENT]',
 * //   secret: '[MISSING]',
 * //   token: '[PRESENT]',
 * //   key: '[PRESENT]',
 * //   patient_id: '[PRESENT]', // container 'id' => unsafe
 * //   patient_name_id: '[PRESENT]', // Explicitly included
 * //   clientId: '[PRESENT]',
 * //   clientName: '[PRESENT]' // Excluded for safety
 * // }
 */

export function safeObject<T>(
	obj: T,
	options?: Partial<ConfigToSafeOptions>,
): T | Record<string, unknown> {
	const result = {} as Record<string, unknown>;

	if (!obj || !isObject(obj) || isEmpty(obj)) return obj;

	const delimeter = options?.delimiter || "_";

	const safeKeys = options?.exclude || [];

	for (const key in obj as object) {
		const value = path([key], obj);

		if (value !== undefined && value !== null) {
			if (Array.isArray(value))
				result[key] = value.map((v) => safeObject(v, options));
			else if (isObject(value)) result[key] = safeObject(value, options);
			else {
				if (safeKeys.includes(key)) result[key] = value;
				else {
					const keyIngredients = splitString(key, delimeter);

					const isUnsafe = keyIngredients.some(checkIfUnSafe(options));

					if (isUnsafe)
						result[key] = isEmpty(value) ? "[MISSING]" : "[PRESENT]";
					else result[key] = value;
				}
			}
		}
	}

	return result;
}
