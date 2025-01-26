import {
	CallPeopleEvent,
	CityEvent,
	CityInitializedEvent,
	EnableProtectedMachineEvent,
	FavorabilityChangedEvent,
	RefreshEvent,
	ValveClosedEvent,
} from "./CityEvent";
import { Npc, NpcName } from "./Npc";

type EventHandler<T extends CityEvent> = (event: T) => void;
type Conversation = { role: "user" | "assistant"; content: string };

export class City {
	static readonly MAX_LIFE = 60 * 20 * 1000; // 20 minutes
	static readonly MAX_DAMAGE = 100;
	static readonly MIN_DAMAGE = 0;
	static readonly TARGET_DAMAGE_RATE = 0;
	static readonly DAMAGE_RATE_DECREASE_RATIO = 0.5;
	static readonly REQUIRED_MAX_FAVORABILITY_NPC = 3;
	static readonly REQUIRED_MIN_FAVORABILITY = 80;

	private conversations: Record<NpcName, Conversation[]> = Object.keys(
		NpcName,
	).reduce(
		(acc, name) => {
			acc[name as NpcName] = [];
			return acc;
		},
		{} as Record<NpcName, Conversation[]>,
	);

	private _events: CityEvent[] = [];
	private _life = City.MAX_LIFE;
	private _damageRate = 0;
	private _valveClosed = false;
	private updatedAt?: Date;
	private _npcs: Npc[] = [];

	private _protecteMachineEnabled = false;
	private _peopleIsCalled = false;

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
			(count, npc) =>
				npc.favorability === City.REQUIRED_MIN_FAVORABILITY ? count + 1 : count,
			0,
		);

		if (maxFavorabilityNpcCount < City.REQUIRED_MAX_FAVORABILITY_NPC) {
			return false;
		}

		this.apply(new ValveClosedEvent({}));
		return true;
	}

	public enableProtectedMachine(): boolean {
		if (this._protecteMachineEnabled) {
			return false;
		}

		this.apply(new EnableProtectedMachineEvent({}));
		return true;
	}

	public callPeople(): boolean {
		if (this._peopleIsCalled) {
			return false;
		}

		this.apply(new CallPeopleEvent({}));
		return true;
	}

	public addConversation(npcName: NpcName, conversation: Conversation): void {
		this.conversations[npcName].push(conversation);
	}

	public findConversations(npcName: NpcName): Conversation[] {
		return [...this.conversations[npcName]];
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

	public onEnableProtectedMachineEvent(
		event: EnableProtectedMachineEvent,
	): void {
		this._damageRate = this._damageRate * City.DAMAGE_RATE_DECREASE_RATIO;
		this._protecteMachineEnabled = true;
	}

	public onCallPeopleEvent(event: CallPeopleEvent): void {
		this._damageRate = this._damageRate * City.DAMAGE_RATE_DECREASE_RATIO;
		this._peopleIsCalled = true;
	}
}
