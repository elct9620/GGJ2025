import { inject, injectable } from "tsyringe-neo";
import Mustache from "mustache";
import welcomeMessage from "./text/welcome.txt";
import { Config } from "@app/config";

@injectable()
export class WelcomeMessageBuilder {
	constructor(@inject(Config) private readonly config: Config) {}

	build(userId: string): string {
		return Mustache.render(welcomeMessage, {
			userId,
			config: this.config,
		});
	}
}
