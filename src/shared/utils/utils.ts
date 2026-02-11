export function cx(...inputs: (string | boolean | undefined | null)[]): string {
	return inputs.filter(Boolean).join(" ");
}
