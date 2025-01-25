import { inject, injectable } from "tsyringe-neo";
import { z } from "zod";
import { tool, type LanguageModelV1 } from "ai";
import Mustache from "mustache";

import { trackGenerateText } from "./utils";
import { OpenAi } from "@app/container";
import { Config } from "@app/config";
import system from "./prompts/jack.md";
import { City } from "@entity/City";
import { NpcName } from "@entity/Npc";
import {
	canChangeFavorability,
	canGetFavorability,
} from "./tools/Favorability";
import { canCloseValve } from "./tools/Valve";

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
				damageProgress: city.damage,
				damageRate: city.damageRate,
				isEnded: city.isEnded,
				isDestroyed: city.isDestroyed,
			}),
			maxSteps: 15,
			tools: {
				getFavorability: canGetFavorability(NpcName.Jack, city),
				changeFavorability: canChangeFavorability(NpcName.Jack, city),
				closeValve: canCloseValve(city),
			},
		});

		return reply.text;
	}
}
