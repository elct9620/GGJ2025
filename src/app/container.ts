import { SESv2Client } from "@aws-sdk/client-sesv2";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import {
	container,
	DependencyContainer,
	instanceCachingFactory,
} from "tsyringe-neo";

import { Config } from "./config";
import { LlmBreadcrumb } from "./llm/middleware";

export const OpenAi = Symbol("OpenAi");
export const OpenAiModelId = "gpt-4o-mini";
export const CloudFlareKv = Symbol("CloudFlareKv");

container.register(SESv2Client, {
	useFactory: (c) => {
		const config = c.resolve<Config>(Config);

		return new SESv2Client({
			region: "ap-northeast-1",
			credentials: {
				accessKeyId: config.awsAccessKeyId,
				secretAccessKey: config.awsSecretAccessKey,
			},
		});
	},
});

container.register(OpenAi, {
	useFactory: instanceCachingFactory((c) => {
		const config = c.resolve<Config>(Config);

		return wrapLanguageModel({
			model: createOpenAI({
				baseURL: config.openAiGateway,
				apiKey: config.openAiApiKey,
			})(OpenAiModelId),
			middleware: LlmBreadcrumb,
		});
	}),
});

export function getContainer(env: Env): DependencyContainer {
	const c = container.createChildContainer();

	c.register(Config, {
		useValue: new Config(
			env.AWS_ACCESS_KEY_ID,
			env.AWS_SECRET_ACCESS_KEY,
			env.OPENAI_GATEWAY,
			env.OPENAI_API_KEY,
			env.DOMAIN,
		),
	});

	c.register(CloudFlareKv, {
		useValue: env.STORE,
	});

	return c;
}
