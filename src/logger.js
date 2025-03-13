function d(m) {
	if (m === null || m === undefined) return m;

	let result = m;

	if (typeof result === "string") {
		try {
			result = JSON.parse(result);
		} catch (_) {
			console.error("Error parsing message", m);
		}
	}

	return result;
}

function logMessage(detail) {
	const m = d(detail);

	const { type } = m;

	let l = console.log;

	if (m.type) l = console[type];

	const message =
		"ℹ️" +
		" " +
		Object.entries(m)
			.map(([k, v]) => `${k}: ${v}`)
			.join(" | ");

	l(message);
}

function logger(enable = true) {
	if (enable) {
		globalThis.document.addEventListener("log", (data) =>
			// @ts-ignore
			logMessage(data.detail),
		);
		globalThis.console.log("Logging enabled");
	} else {
		globalThis.document.removeEventListener("log", (data) =>
			// @ts-ignore
			logMessage(data.detail),
		);
		// eslint-disable-next-line no-console -- required
		console.log("Logging disabled");
	}
}

globalThis.window.logger = logger;
globalThis.window.logger();
