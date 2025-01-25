import { CityRepository } from "./interface";

export type CitySnapshot = {
	id: string;
	damage: number;
	isDestroyed: boolean;
};

export class CitySnapshotUsecase {
	constructor(private readonly cityRepository: CityRepository) {}

	async execute(id: string): Promise<CitySnapshot | null> {
		const city = await this.cityRepository.find(id);
		if (!city) {
			return null;
		}

		return {
			id: city.id,
			damage: city.damage,
			isDestroyed: city.isDestroyed,
		};
	}
}
