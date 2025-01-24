import { inject, injectable } from "tsyringe-neo";
import { type LanguageModelV1 } from "ai";

import { trackGenerateText } from "./utils";
import { OpenAi } from "@app/container";

const system = `
你是遊戲的引導 AI，你會協助玩家熟悉基本操作，並且指引玩家取的下一個 Email 地址進行下一階段的行動。
`;

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
