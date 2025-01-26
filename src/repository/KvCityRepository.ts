import { type KVNamespace } from "@cloudflare/workers-types";
import { inject, injectable } from "tsyringe-neo";
import { CloudFlareKv } from "@app/container";
import { City } from "@entity/City";
import {
	CityEvent,
	CityEventType,
	CityInitializedEvent,
	FavorabilityChangedEvent,
	RefreshEvent,
	ValveClosedEvent,
} from "@entity/CityEvent";
import { addBreadcrumb } from "@sentry/cloudflare";
import { Config } from "@app/config";
import { NpcName } from "@entity/Npc";

type EventSchema = {
	type: string;
	payload: Record<string, any>;
	createdAt: string;
};

type Conversation = { role: "user" | "assistant"; content: string };

type CitySchema = {
	events: EventSchema[];
	conversations: Record<NpcName, Conversation[]>;
};

@injectable()
export class KvCityRepository {
	public static readonly Prefix = "city";

	constructor(
		@inject(CloudFlareKv) private readonly kv: KVNamespace,
		@inject(Config) private readonly config: Config,
	) {}

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

	async findSnapshot(userId: string): Promise<City | null> {
		const data = (await this.kv.get(
			`${KvCityRepository.Prefix}:${userId}`,
			"json",
		)) as CitySchema;
		if (!data) {
			return null;
		}

		const city = new City(userId);
		const events = data.events || [];
		const conversations = data.conversations || {};

		const now = new Date();
		const visibleTime =
			now.getTime() - this.config.snapshotLatencyInSeconds * 1000;

		events.forEach((event) => {
			const rebuildedEvent = this.rebuildEvent(event);
			const isVisible = rebuildedEvent.createdAt.getTime() <= visibleTime;
			const isInitialized =
				rebuildedEvent.type === CityEventType.CityInitializedEvent;

			if (isInitialized || isVisible) {
				city.apply(rebuildedEvent);
			}
		});

		Object.keys(NpcName).forEach((name) => {
			const npcName = name as NpcName;
			const conversation = conversations[npcName] || [];
			conversation.forEach((c) => {
				city.addConversation(npcName, c);
			});
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
				npcStatus: Object.keys(NpcName).map((name) => ({
					name,
					favorability: city.findNpc(name as NpcName)?.favorability,
				})),
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
				conversations: Object.keys(NpcName).reduce(
					(acc, name) => {
						acc[name as NpcName] = city.findConversations(name as NpcName);
						return acc;
					},
					{} as Record<NpcName, Conversation[]>,
				),
			}),
			{
				expirationTtl: this.config.maxRetentionInSeconds,
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
			case CityEventType.FavorabilityChangedEvent:
				return new FavorabilityChangedEvent(
					event.payload as { npcName: NpcName; change: number },
					new Date(event.createdAt),
				);
			case CityEventType.ValveClosedEvent:
				return new ValveClosedEvent(event.payload, new Date(event.createdAt));
			default:
				throw new Error(`Unknown event type: ${event.type}`);
		}
	}
}
