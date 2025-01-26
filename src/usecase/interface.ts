import { City } from "@entity/City";
import { NpcName } from "@entity/Npc";

export interface EmailPresenter {
	addText(text: string): void;
}

export interface Agent {
	talk(prompt: string): Promise<string>;
}

export interface Npc {
	get name(): NpcName;
	talk(city: City): Promise<string>;
}

export interface CityRepository {
	find(userId: string): Promise<City | null>;
	findSnapshot(userId: string): Promise<City | null>;
	save(city: City): Promise<void>;
	destroy(userId: string): Promise<void>;
}

export interface WelcomeMessageBuilder {
	build(userId: string): string;
}

export interface EndMessageBuilder {
	build(userId: string, city: City): string;
}
