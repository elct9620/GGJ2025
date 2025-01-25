import { inject, injectable } from "tsyringe-neo";
import { type LanguageModelV1 } from "ai";
import Mustache from "mustache";

import { trackGenerateText } from "./utils";
import { OpenAi } from "@app/container";
import { Config } from "@app/config";
import system from "./prompts/jack.md";
import { City } from "@entity/City";

@injectable()
export class NpcJack {
	constructor(
		@inject(OpenAi) private readonly openai: LanguageModelV1,
		@inject(Config) private readonly config: Config,
	) {}

	async talk(city: City, prompt: string): Promise<string> {
		const reply = await trackGenerateText("NpcJack.talk", {
			model: this.openai,
			temperature: 0.5,
			prompt,
			system: Mustache.render(system, {
				config: this.config,
			}),
		});

		return reply.text;
	}
}
