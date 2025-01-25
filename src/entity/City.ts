import { handle } from "hono/cloudflare-pages";
import { CityEvent, CityEventType, CityInitializedEvent } from "./CityEvent";

type EventHandler<T extends CityEvent> = (event: T) => void;

export class City {
	static readonly MAX_LIFE_TIME = 60 * 10 * 1000; // 10 minutes
	static readonly DAMAGE_SCALE = 10000;
	static readonly MAX_DAMAGE = 100;
	static readonly MIN_DAMAGE = 0;
	static readonly TARGET_DAMAGE_RATE = 0;

	private _events: CityEvent[] = [];
	private _damage = 0;
	private _damageRate = 0;

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

	public get damage(): number {
		return Math.max(
			Math.min(this._damage / City.DAMAGE_SCALE, City.MAX_DAMAGE),
			City.MIN_DAMAGE,
		);
	}

	public get damageRate(): number {
		return Math.max(this._damageRate, 1, City.TARGET_DAMAGE_RATE);
	}

	public get isDestroyed(): boolean {
		return this.damage >= City.MAX_DAMAGE;
	}

	public get isEnded(): boolean {
		return City.TARGET_DAMAGE_RATE >= this._damageRate || this.isDestroyed;
	}

	public get events(): CityEvent[] {
		return this._events.map((event) => ({ ...event }) as CityEvent);
	}

	private onCityInitializedEvent(event: CityInitializedEvent): void {
		this._damage = 0;
		this._damageRate =
			(City.MAX_DAMAGE * City.DAMAGE_SCALE) / City.MAX_LIFE_TIME;
	}
}
