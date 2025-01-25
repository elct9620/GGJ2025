export enum CityEventType {
	CityInitializedEvent = "CityInitializedEvent",
	RefreshEvent = "RefreshEvent",
}

abstract class Event {
	constructor(
		public readonly type: CityEventType,
		public readonly _payload: Record<string, any>,
		public readonly createdAt: Date = new Date(),
	) {}

	get payload(): Record<string, any> {
		return { ...this._payload };
	}
}

export class CityInitializedEvent extends Event {
	constructor(payload: Record<string, any>) {
		super(CityEventType.CityInitializedEvent, payload);
	}
}

export class RefreshEvent extends Event {
	constructor(payload: Record<string, any>) {
		super(CityEventType.RefreshEvent, payload);
	}
}

export type CityEvent = CityInitializedEvent | RefreshEvent;
