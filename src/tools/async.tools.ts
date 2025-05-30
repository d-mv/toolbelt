export async function delay(ms: number): Promise<string> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve("");
		}, ms);
	});
}
