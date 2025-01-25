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
			this.presenter.addText("Your find a new city");
			return;
		}

		const reply = await this.agent.talk(message);

		this.presenter.addText(reply);
	}
}
