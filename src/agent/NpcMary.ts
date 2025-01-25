import { inject, injectable } from "tsyringe-neo";
import { z } from "zod";
import { tool, type LanguageModelV1 } from "ai";
import Mustache from "mustache";

import { trackGenerateText } from "./utils";
import { OpenAi } from "@app/container";
import { Config } from "@app/config";
import system from "./prompts/mary.md";
import { City } from "@entity/City";
import { NpcName } from "@entity/Npc";
import {
	canChangeFavorability,
	canGetFavorability,
} from "./tools/Favorability";

@injectable()
export class NpcMary {
	constructor(
		@inject(OpenAi) private readonly openai: LanguageModelV1,
		@inject(Config) private readonly config: Config,
	) {}

	async talk(city: City, prompt: string): Promise<string> {
		const reply = await trackGenerateText("NpcMary.talk", {
			model: this.openai,
			temperature: 0.5,
			prompt,
			system: Mustache.render(system, {
				config: this.config,
			}),
			maxSteps: 15,
			tools: {
				getFavorability: canGetFavorability(NpcName.Mary, city),
				changeFavorability: canChangeFavorability(NpcName.Mary, city),
			},
		});

		return reply.text;
	}
}
