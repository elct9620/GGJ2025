import { City } from "@entity/City";
import {
	EmailPresenter,
	CityRepository,
	Agent,
	WelcomeMessageBuilder,
	EndMessageBuilder,
} from "./interface";

export class GuideUsecase {
	constructor(
		private readonly presenter: EmailPresenter,
		private readonly welcomeMessageBuilder: WelcomeMessageBuilder,
		private readonly endMessageBuilder: EndMessageBuilder,
		private readonly agent: Agent,
		private readonly cityRepository: CityRepository,
	) {}

	async execute(userId: string, message: string): Promise<void> {
		const city = await this.cityRepository.find(userId);
		if (!city) {
			await this.cityRepository.save(City.create(userId));

			const welcomeMessage = this.welcomeMessageBuilder.build(userId);
			this.presenter.addText(welcomeMessage);
			return;
		}

		city.refresh();
		if (city.isEnded) {
			const endMessage = this.endMessageBuilder.build(userId, city);
			this.presenter.addText(endMessage);

			return;
		}

		const reply = await this.agent.talk(message);
		this.presenter.addText(reply);

		await this.cityRepository.save(city);
	}
}
