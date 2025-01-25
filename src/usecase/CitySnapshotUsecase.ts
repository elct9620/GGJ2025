import { NpcName } from "@entity/Npc";
import { CityRepository } from "./interface";

type NpcStatus = Record<NpcName, { favorability: number }>;

export type CitySnapshot = {
	id: string;
	damage: number;
	isDestroyed: boolean;
	isEnded: boolean;
	npcStatus: NpcStatus;
};

export class CitySnapshotUsecase {
	constructor(private readonly cityRepository: CityRepository) {}

	async execute(id: string): Promise<CitySnapshot | null> {
		const city = await this.cityRepository.findSnapshot(id);
		if (!city) {
			return null;
		}

		return {
			id: city.id,
			damage: city.damage,
			isDestroyed: city.isDestroyed,
			isEnded: city.isEnded,
			npcStatus: Object.keys(NpcName).reduce((acc, name) => {
				acc[name as NpcName] = {
					favorability: city.findNpc(name as NpcName)?.favorability || 50,
				};
				return acc;
			}, {} as NpcStatus),
		};
	}
}
