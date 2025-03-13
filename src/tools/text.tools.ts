import { path } from "ramda";
import type { RecordObject } from "../types";

function buildPath(
	sectionOrPath: string | string[],
	keyOrPath: string | string[],
) {
	const pathToValue =
		typeof sectionOrPath === "string" ? [sectionOrPath] : sectionOrPath;

	return typeof keyOrPath === "string"
		? [...pathToValue, keyOrPath]
		: [...pathToValue, ...keyOrPath];
}

export function useText(textData: RecordObject) {
	return function setSection(sectionOrPath: string | string[]) {
		return function get(keyOrPath: string | string[]) {
			return (
				(path(buildPath(sectionOrPath, keyOrPath), textData) as string) ?? ""
			);
		};
	};
}

export function fromTemplate(
	template: string,
	params: (string | number)[],
): string {
	let result = template;

	if (!params) return template;

	params.forEach((param: string | number, key: number) => {
		result = result.replace(new RegExp(`%${key + 1}`, "g"), String(param));
	});
	return result;
}
