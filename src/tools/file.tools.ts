import { None, Option, Some } from "./monad.tools";

export async function imageEncoder(
	file: Blob,
): Promise<Option<string | ArrayBuffer>> {
	return new Promise((resolve) => {
		const reader = new FileReader();

		reader.readAsDataURL(file);
		reader.onloadend = () => {
			if (reader.result) resolve(Some(reader.result));
			else resolve(None);
		};
	});
}
