import { CoreTool, type LanguageModelV1 } from "ai";
import Mustache from "mustache";

import { Config } from "@app/config";
import { City } from "@entity/City";
import { NpcName } from "@entity/Npc";
import { trackGenerateText } from "./utils";

export abstract class Npc {
	protected readonly maxSteps = 15;

	constructor(
		protected readonly openai: LanguageModelV1,
		protected readonly config: Config,
	) {}

	abstract get name(): NpcName;
	abstract get temperature(): number;
	protected abstract buildTools(
		city: City,
	): Record<string, CoreTool> | undefined;
	abstract get system(): string;

	async talk(city: City): Promise<string> {
		const reply = await trackGenerateText(`Npc${this.name}.talk`, {
			model: this.openai,
			temperature: this.temperature,
			messages: city.findConversations(this.name),
			system: Mustache.render(this.system, {
				config: this.config,
				damageProgress: city.damage,
				damageRate: city.damageRate,
				isEnded: city.isEnded,
				isDestroyed: city.isDestroyed,
				favorability: city.findNpc(this.name)?.favorability ?? 50,
			}),
			tools: this.buildTools(city),
			maxSteps: this.maxSteps,
		});

		city.addConversation(this.name, { role: "assistant", content: reply.text });

		return reply.text;
	}
}
