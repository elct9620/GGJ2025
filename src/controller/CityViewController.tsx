/** @jsxImportSource hono/jsx */

import { inject, injectable } from "tsyringe-neo";
import { HtmlEscapedString } from "hono/utils/html";

import { KvCityRepository } from "@repository/KvCityRepository";
import { CitySnapshotUsecase } from "@usecase/CitySnapshotUsecase";
import { City } from "@view/City";

@injectable()
export class CityViewController {
	constructor(
		@inject(KvCityRepository) private readonly cityRepository: KvCityRepository,
	) {}

	async handle(id: string): Promise<HtmlEscapedString | null> {
		const usecase = new CitySnapshotUsecase(this.cityRepository);
		const snapshot = await usecase.execute(id);

		if (!snapshot) {
			return null;
		}

		return <City {...snapshot} />;
	}
}
