import { type KVNamespace } from "@cloudflare/workers-types";
import { inject, injectable } from "tsyringe-neo";
import { CloudFlareKv } from "@app/container";
import { City } from "@entity/City";

type CitySchema = {};

@injectable()
export class KvCityRepository {
	public static readonly Prefix = "city";

	constructor(@inject(CloudFlareKv) private readonly kv: KVNamespace) {}

	async find(userId: string): Promise<City | null> {
		const data = (await this.kv.get(
			`${KvCityRepository.Prefix}:${userId}`,
			"json",
		)) as CitySchema;
		if (!data) {
			return null;
		}

		return new City(userId);
	}
}
