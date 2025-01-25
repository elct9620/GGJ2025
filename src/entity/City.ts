import { handle } from "hono/cloudflare-pages";
import {
	CityEvent,
	CityEventType,
	CityInitializedEvent,
	FavorabilityChangedEvent,
	RefreshEvent,
	ValveClosedEvent,
} from "./CityEvent";
import { Npc, NpcName } from "./Npc";

type EventHandler<T extends CityEvent> = (event: T) => void;

export class City {
	static readonly MAX_LIFE = 60 * 10 * 1000; // 10 minutes
	static readonly MAX_DAMAGE = 100;
	static readonly MIN_DAMAGE = 0;
	static readonly TARGET_DAMAGE_RATE = 0;
	static readonly REQUIRED_MAX_FAVORABILITY_NPC = 3;

	private _events: CityEvent[] = [];
	private _life = City.MAX_LIFE;
	private _damageRate = 0;
	private _valveClosed = false;
	private updatedAt?: Date;
	private _npcs: Npc[] = [];

	static create(id: string): City {
		const city = new City(id);
		city.apply(new CityInitializedEvent({}));
		return city;
	}

	constructor(public readonly id: string) {}

	public apply(event: CityEvent): void {
		const handlerName = `on${event.type}` as keyof this;
		const handler = this[handlerName] as EventHandler<typeof event>;
		if (!handler) {
			throw new Error(`Missing event handler: ${String(handlerName)}`);
		}

		handler.apply(this, [event]);
		this._events.push(event);
	}

	public refresh(): void {
		this.apply(new RefreshEvent({}));
	}

	public changeFavorability(npcName: NpcName, change: number): void {
		this.apply(new FavorabilityChangedEvent({ npcName, change }));
	}

	public closeValve(): boolean {
		if (this.isEnded || this.isValveClosed) {
			return false;
		}

		const maxFavorabilityNpcCount = this._npcs.reduce(
			(count, npc) => (npc.favorability === 100 ? count + 1 : count),
			0,
		);

		if (maxFavorabilityNpcCount < City.REQUIRED_MAX_FAVORABILITY_NPC) {
			return false;
		}

		this.apply(new ValveClosedEvent({}));
		return true;
	}

	public get damage(): number {
		const currentDamage =
			City.MAX_DAMAGE - Math.floor((this._life * 100) / City.MAX_LIFE);

		return Math.max(Math.min(currentDamage, City.MAX_DAMAGE), City.MIN_DAMAGE);
	}

	public get damageRate(): number {
		return Math.max(this._damageRate, City.TARGET_DAMAGE_RATE);
	}

	public get isValveClosed(): boolean {
		return this._valveClosed;
	}

	public get isDestroyed(): boolean {
		return this.damage >= City.MAX_DAMAGE;
	}

	public get isEnded(): boolean {
		return City.TARGET_DAMAGE_RATE >= this._damageRate || this.isDestroyed;
	}

	public get events(): CityEvent[] {
		return [...this._events];
	}

	public findNpc(name: NpcName): Npc | undefined {
		return this._npcs.find((npc) => npc.name === name);
	}

	private onCityInitializedEvent(event: CityInitializedEvent): void {
		this._life = City.MAX_LIFE;
		this._damageRate = 1;
		this.updatedAt = event.createdAt;

		Object.keys(NpcName).forEach((name) => {
			this._npcs.push(new Npc(name as NpcName));
		});
	}

	private onRefreshEvent(event: RefreshEvent): void {
		const deltaTime = event.createdAt.getTime() - this.updatedAt!.getTime();
		this._life -= deltaTime * this._damageRate;
		this.updatedAt = event.createdAt;
	}

	private onFavorabilityChangedEvent(event: FavorabilityChangedEvent): void {
		const npc = this.findNpc(event.payload.npcName);
		if (!npc) {
			throw new Error(`Npc not found: ${event.payload.npcName}`);
		}

		npc.changeFavorability(event.payload.change);
	}

	private onValveClosedEvent(event: ValveClosedEvent): void {
		this._damageRate = 0;
		this._valveClosed = true;
	}
}
