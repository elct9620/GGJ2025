export async function sha256(input: string): Promise<string> {
	const encoder = new TextEncoder().encode(input);
	const hash = await crypto.subtle.digest(
		{
			name: "SHA-256",
		},
		encoder,
	);

	return Buffer.from(hash).toString("hex");
}
