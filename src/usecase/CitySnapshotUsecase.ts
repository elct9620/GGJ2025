import { CityRepository } from "./interface";

type CitySnapshot = {
	id: string;
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
		};
	}
}
