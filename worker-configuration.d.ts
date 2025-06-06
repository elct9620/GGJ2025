// Generated by Wrangler by running `wrangler types`

interface Env {
	STORE: KVNamespace;
	SENTRY_DSN: string;
	AWS_ACCESS_KEY_ID: string;
	AWS_SECRET_ACCESS_KEY: string;
	OPENAI_API_KEY: string;
	OPENAI_GATEWAY: string;
	DOMAIN: string;
	CF_VERSION_METADATA: { id: string; tag: string };
}
declare module "*.md" {
	const value: string;
	export default value;
}
declare module "*.txt" {
	const value: string;
	export default value;
}