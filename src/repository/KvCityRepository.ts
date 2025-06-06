import { Config } from "@app/config";
import { CloudFlareKv } from "@app/container";
import { type KVNamespace } from "@cloudflare/workers-types";
import { City } from "@entity/City";
import {
	CallPeopleEvent,
	CityEvent,
	CityEventType,
	CityInitializedEvent,
	EnableProtectedMachineEvent,
	FavorabilityChangedEvent,
	RefreshEvent,
	ValveClosedEvent,
} from "@entity/CityEvent";
import { NpcName } from "@entity/Npc";
import { addBreadcrumb } from "@sentry/cloudflare";
import { inject, injectable } from "tsyringe-neo";

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
		const conversations = data.conversations || {};

		events.forEach((event) => {
			city.apply(this.rebuildEvent(event));
		});

		Object.keys(NpcName).forEach((name) => {
			const npcName = name as NpcName;
			const conversation = conversations[npcName] || [];
			conversation.forEach((c) => {
				city.addConversation(npcName, { role: c.role, content: c.content });
			});
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

		return city;
	}

	async save(city: City): Promise<void> {
		const conversations = Object.keys(NpcName).reduce(
			(acc, name) => {
				acc[name as NpcName] = city.findConversations(name as NpcName);
				return acc;
			},
			{} as Record<NpcName, Conversation[]>,
		);

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

		Object.keys(NpcName).forEach((name) => {
			const conversation = conversations[name as NpcName];
			addBreadcrumb({
				type: "debug",
				category: "game.conversation",
				data: {
					name: name,
					conversation: conversation,
				},
			});
		});

		await this.kv.put(
			`${KvCityRepository.Prefix}:${city.id}`,
			JSON.stringify({
				events: city.events.map((event) => ({
					type: event.type,
					payload: event.payload,
					createdAt: event.createdAt.toISOString(),
				})),
				conversations,
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
			case CityEventType.EnableProtectedMachineEvent:
				return new EnableProtectedMachineEvent(
					event.payload,
					new Date(event.createdAt),
				);
			case CityEventType.CallPeopleEvent:
				return new CallPeopleEvent(event.payload, new Date(event.createdAt));
			default:
				throw new Error(`Unknown event type: ${event.type}`);
		}
	}
}
