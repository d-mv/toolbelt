export function getId() {
	// Generate a standard UUID
	const uuid = crypto.randomUUID();

	// Convert the UUID to a Buffer
	const buffer = Buffer.from(uuid.replace(/-/g, ""), "hex");

	// Encode the Buffer in Base64 and remove padding
	const shortUUID = buffer
		.toString("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");

	return shortUUID;
}
