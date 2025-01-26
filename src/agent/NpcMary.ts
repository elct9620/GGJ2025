import { CoreTool, type LanguageModelV1 } from "ai";
import { inject, injectable } from "tsyringe-neo";

import { Config } from "@app/config";
import { OpenAi } from "@app/container";
import { City } from "@entity/City";
import { NpcName } from "@entity/Npc";
import { Npc } from "./Npc";
import system from "./prompts/mary.md";
import {
	canChangeFavorability,
	canGetFavorability,
} from "./tools/Favorability";
import { canCallPeople } from "./tools/Skill";

@injectable()
export class NpcMary extends Npc {
	public readonly name = NpcName.Mary;
	public readonly temperature = 0.5;
	public readonly system = system;

	constructor(
		@inject(OpenAi) openai: LanguageModelV1,
		@inject(Config) config: Config,
	) {
		super(openai, config);
	}

	protected buildTools(city: City): Record<string, CoreTool> {
		return {
			getFavorability: canGetFavorability(this.name, city),
			changeFavorability: canChangeFavorability(this.name, city),
			callPeople: canCallPeople(city),
		};
	}
}
