import { inject, injectable } from "tsyringe-neo";
import { type LanguageModelV1 } from "ai";
import Mustache from "mustache";

import { trackGenerateText } from "./utils";
import { OpenAi } from "@app/container";
import system from "./prompts/guide.md";
import { Config } from "@app/config";
import { config } from "process";

@injectable()
export class GuideAgent {
	constructor(
		@inject(OpenAi) private readonly openai: LanguageModelV1,
		@inject(Config) private readonly config: Config,
	) {}

	async talk(prompt: string): Promise<string> {
		const reply = await trackGenerateText("GuideAgent.talk", {
			model: this.openai,
			prompt,
			system: Mustache.render(system, { config }),
		});

		return reply.text;
	}
}
