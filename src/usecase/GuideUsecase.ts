import { City } from "@entity/City";
import { EmailPresenter, CityRepository, Agent } from "./interface";

export class GuideUsecase {
	constructor(
		private readonly presenter: EmailPresenter,
		private readonly agent: Agent,
		private readonly cityRepository: CityRepository,
	) {}

	async execute(userId: string, message: string): Promise<void> {
		const city = await this.cityRepository.find(userId);
		if (!city) {
			await this.cityRepository.save(new City(userId));
			this.presenter.addText("Welcome to the city!");
			return;
		}

		const reply = await this.agent.talk(message);

		this.presenter.addText(reply);
	}
}
