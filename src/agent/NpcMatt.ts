import { inject, injectable } from "tsyringe-neo";
import { z } from "zod";
import { tool, type LanguageModelV1 } from "ai";
import Mustache from "mustache";

import { trackGenerateText } from "./utils";
import { OpenAi } from "@app/container";
import { Config } from "@app/config";
import system from "./prompts/matt.md";
import { City } from "@entity/City";
import { NpcName } from "@entity/Npc";
import {
	canChangeFavorability,
	canGetFavorability,
} from "./tools/Favorability";
import { canEnableProtectMachine } from "./tools/Skill";

@injectable()
export class NpcMatt {
	public readonly name = NpcName.Matt;

	constructor(
		@inject(OpenAi) private readonly openai: LanguageModelV1,
		@inject(Config) private readonly config: Config,
	) {}

	async talk(city: City): Promise<string> {
		const reply = await trackGenerateText("NpcMatt.talk", {
			model: this.openai,
			temperature: 0.7,
			messages: city.findConversations(this.name),
			system: Mustache.render(system, {
				config: this.config,
				isEnded: city.isEnded,
				isDestroyed: city.isDestroyed,
				favorability() {
					return city.findNpc(this.name)?.favorability ?? 50;
				},
			}),
			maxSteps: 15,
			tools: {
				getFavorability: canGetFavorability(this.name, city),
				changeFavorability: canChangeFavorability(this.name, city),
				enableProtectMachine: canEnableProtectMachine(city),
			},
		});

		city.addConversation(this.name, { role: "assistant", content: reply.text });

		return reply.text;
	}
}
