import { type KVNamespace } from "@cloudflare/workers-types";
import { inject, injectable } from "tsyringe-neo";
import { CloudFlareKv } from "@app/container";
import { City } from "@entity/City";
import {
	CityEvent,
	CityEventType,
	CityInitializedEvent,
	RefreshEvent,
} from "@entity/CityEvent";
import { addBreadcrumb } from "@sentry/cloudflare";

type EventSchema = {
	type: string;
	payload: Record<string, any>;
	createdAt: string;
};

type CitySchema = {
	events: EventSchema[];
};

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

		const city = new City(userId);
		const events = data.events || [];

		events.forEach((event) => {
			city.apply(this.rebuildEvent(event));
		});

		return city;
	}

	async save(city: City): Promise<void> {
		addBreadcrumb({
			type: "debug",
			category: "game.city",
			data: {
				userId: city.id,
				damage: city.damage,
				damageRate: city.damageRate,
			},
		});

		await this.kv.put(
			`${KvCityRepository.Prefix}:${city.id}`,
			JSON.stringify({
				events: city.events.map((event) => ({
					type: event.type,
					payload: event.payload,
					createdAt: event.createdAt.toISOString(),
				})),
			}),
			{
				expirationTtl: 60 * 60, // 1 hour
			},
		);
	}

	async destroy(userId: string): Promise<void> {
		await this.kv.delete(`${KvCityRepository.Prefix}:${userId}`);
	}

	private rebuildEvent(event: EventSchema): CityEvent {
		switch (event.type) {
			case CityEventType.CityInitializedEvent:
				return new CityInitializedEvent(
					event.payload,
					new Date(event.createdAt),
				);
			case CityEventType.RefreshEvent:
				return new RefreshEvent(event.payload, new Date(event.createdAt));
			default:
				throw new Error(`Unknown event type: ${event.type}`);
		}
	}
}
