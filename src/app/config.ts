export class Config {
	constructor(
		public readonly awsAccessKeyId: string,
		public readonly awsSecretAccessKey: string,
		public readonly openAiGateway: string,
		public readonly openAiApiKey: string,
		public readonly domain: string,
		public readonly maxRetentionInSeconds: number,
	) {}
}
