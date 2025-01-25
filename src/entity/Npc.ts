export enum NpcName {
	Jack = "Jack",
}

export class Npc {
	public static readonly MIN_FAVORABILITY = 0;
	public static readonly MAX_FAVORABILITY = 100;

	private _favorability: number = 50;

	constructor(public readonly name: NpcName) {}

	public get favorability(): number {
		return this._favorability;
	}

	changeFavorability(value: number): void {
		if (this._favorability == Npc.MAX_FAVORABILITY) {
			return;
		}

		const newValue = (this._favorability = value);
		this._favorability = Math.min(
			Math.max(newValue, Npc.MIN_FAVORABILITY),
			Npc.MAX_FAVORABILITY,
		);
	}
}
