import { AnyValue } from "../types";
import { Err, Ok, Result } from "./monad.tools";

export function parseFl(num: AnyValue): Result<number, Error> {
	if (typeof num === "number") return Ok(num);

	if (typeof num !== "string")
		return Err(new TypeError("Unable to parse this type of data"));

	try {
		const result = parseFloat(num);

		if (!isNaN(result)) return Ok(result);

		return Err(new Error("Invalid value"));
	} catch (_) {
		return Err(new Error("Unable to parse"));
	}
}

export function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
