import { City } from "@entity/City";

export interface EmailPresenter {
	addText(text: string): void;
}

export interface Agent {
	talk(prompt: string): Promise<string>;
}

export interface CityRepository {
	find(userId: string): Promise<City>;
}
