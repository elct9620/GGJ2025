import { NpcName } from "./Npc";

export enum CityEventType {
	CityInitializedEvent = "CityInitializedEvent",
	FavorabilityChangedEvent = "FavorabilityChangedEvent",
	RefreshEvent = "RefreshEvent",
}

abstract class Event {
	constructor(
		public readonly type: CityEventType,
		public readonly _payload: Record<string, any>,
		public readonly createdAt: Date,
	) {}

	get payload(): Record<string, any> {
		return { ...this._payload };
	}
}

export class CityInitializedEvent extends Event {
	constructor(payload: {}, createdAt: Date = new Date()) {
		super(CityEventType.CityInitializedEvent, payload, createdAt);
	}
}

export class RefreshEvent extends Event {
	constructor(payload: {}, createdAt: Date = new Date()) {
		super(CityEventType.RefreshEvent, payload, createdAt);
	}
}

export class FavorabilityChangedEvent extends Event {
	constructor(
		payload: { npcName: NpcName; change: number },
		createdAt: Date = new Date(),
	) {
		super(CityEventType.FavorabilityChangedEvent, payload, createdAt);
	}
}

export type CityEvent = CityInitializedEvent | RefreshEvent;
