import { City } from "@entity/City";
import {
	EmailPresenter,
	CityRepository,
	Agent,
	WelcomeMessageBuilder,
} from "./interface";

export class GuideUsecase {
	constructor(
		private readonly presenter: EmailPresenter,
		private readonly welcomeMessageBuilder: WelcomeMessageBuilder,
		private readonly agent: Agent,
		private readonly cityRepository: CityRepository,
	) {}

	async execute(userId: string, message: string): Promise<void> {
		const city = await this.cityRepository.find(userId);
		if (!city) {
			await this.cityRepository.save(new City(userId));

			const welcomeMessage = this.welcomeMessageBuilder.build(userId);
			this.presenter.addText(welcomeMessage);
			return;
		}

		const reply = await this.agent.talk(message);

		this.presenter.addText(reply);
	}
}
