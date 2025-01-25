import { inject, injectable } from "tsyringe-neo";
import { type LanguageModelV1 } from "ai";

import { trackGenerateText } from "./utils";
import { OpenAi } from "@app/container";
import system from "./prompts/guide.md";

@injectable()
export class GuideAgent {
	constructor(@inject(OpenAi) private readonly openai: LanguageModelV1) {}

	async talk(prompt: string): Promise<string> {
		const reply = await trackGenerateText("GuideAgent.talk", {
			model: this.openai,
			prompt,
			system,
		});

		return reply.text;
	}
}
