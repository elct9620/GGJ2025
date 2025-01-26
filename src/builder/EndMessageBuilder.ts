import { inject, injectable } from "tsyringe-neo";
import Mustache from "mustache";
import endMessage from "./text/end.txt";
import { Config } from "@app/config";
import { City } from "@entity/City";

@injectable()
export class EndMessageBuilder {
	constructor(@inject(Config) private readonly config: Config) {}

	build(userId: string, city: City): string {
		return Mustache.render(endMessage, {
			userId,
			isDestroyed: city.isDestroyed,
			config: this.config,
		});
	}
}
