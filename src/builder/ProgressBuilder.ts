import { Config } from "@app/config";
import { City } from "@entity/City";
import { inject, injectable } from "tsyringe-neo";

@injectable()
export class ProgressBuilder {
	public static readonly progressFill = "■";
	public static readonly progressEmpty = "□";

	constructor(@inject(Config) private readonly config: Config) {}

	build(city: City): string {
		const progressLength = City.MAX_DAMAGE / 5;
		const progress = Math.floor(city.damage / 5);
		const progressBar = `${ProgressBuilder.progressFill.repeat(progress)}${ProgressBuilder.progressEmpty.repeat(progressLength - progress)}`;

		return `城市損壞度：${progressBar} ${city.damage}%`;
	}
}
