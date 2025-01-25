import { handle } from "hono/cloudflare-pages";
import { CityEvent, CityEventType, CityInitializedEvent } from "./CityEvent";

type EventHandler<T extends CityEvent> = (event: T) => void;

export class City {
	private _events: CityEvent[] = [];

	constructor(public readonly id: string) {
		this.apply(new CityInitializedEvent({}));
	}

	public apply(event: CityEvent): void {
		const handlerName = `on${event.type}` as keyof this;
		const handler = this[handlerName] as EventHandler<typeof event>;
		if (!handler) {
			throw new Error(`Missing event handler: ${String(handlerName)}`);
		}

		handler(event);
		this._events.push(event);
	}

	public get events(): CityEvent[] {
		return this._events.map((event) => ({ ...event }) as CityEvent);
	}

	private onCityInitializedEvent(event: CityInitializedEvent): void {
		// Do nothing
	}
}
