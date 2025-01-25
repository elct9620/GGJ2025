/** @jsxImportSource hono/jsx */

import { KvCityRepository } from "@repository/KvCityRepository";
import { CitySnapshotUsecase } from "@usecase/CitySnapshotUsecase";
import { inject, injectable } from "tsyringe-neo";
import { HtmlEscapedString } from "hono/utils/html";

@injectable()
export class CityViewController {
	constructor(
		@inject(KvCityRepository) private readonly cityRepository: KvCityRepository,
	) {}

	async handle(id: string): Promise<HtmlEscapedString | null> {
		const usecase = new CitySnapshotUsecase(this.cityRepository);
		const snapshot = await usecase.execute(id);

		if (!snapshot) {
			return <div>City not found</div>;
		}

		return <div>CityId - {snapshot.id}</div>;
	}
}
