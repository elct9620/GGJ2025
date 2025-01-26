import { Config } from "@app/config";
import { City } from "@entity/City";
import Mustache from "mustache";
import { inject, injectable } from "tsyringe-neo";
import endMessage from "./text/end.txt";

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
