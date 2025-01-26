import { inject, injectable } from "tsyringe-neo";
import { z } from "zod";
import { CoreMessage, CoreTool, tool, type LanguageModelV1 } from "ai";
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
import { Npc } from "./Npc";

@injectable()
export class NpcJack extends Npc {
	public readonly name = NpcName.Jack;
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
			closeValve: canCloseValve(city),
		};
	}
}
