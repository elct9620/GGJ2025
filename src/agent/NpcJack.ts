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
			maxSteps: 15,
			tools: {
				getFavorability: tool({
					description: "Get the favorability of the NPC",
					parameters: z.object({}),
					execute: async () => {
						const favorability = city.findNpc(NpcName.Jack)?.favorability;

						return { favorability };
					},
				}),
				changeFavorability: tool({
					description:
						"According to the interaction with the NPC change the favorability",
					parameters: z.object({
						change: z.number().int().min(-10).max(10),
					}),
					execute: async ({ change }) => {
						const prevFavorability = city.findNpc(NpcName.Jack)?.favorability;
						city.changeFavorability(NpcName.Jack, change);
						const newFavorability = city.findNpc(NpcName.Jack)?.favorability;

						return { change, prevFavorability, newFavorability };
					},
				}),
			},
		});

		return reply.text;
	}
}
