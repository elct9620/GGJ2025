import { Config } from "@app/config";
import Mustache from "mustache";
import { inject, injectable } from "tsyringe-neo";
import welcomeMessage from "./text/welcome.txt";

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
