import { CityRepository, EmailPresenter, Npc } from "./interface";

export class TaklWithNpcUsecase {
	constructor(
		private readonly presenter: EmailPresenter,
		private readonly cityRepository: CityRepository,
		private readonly npc: Npc,
	) {}

	async execute(userId: string, message: string): Promise<void> {
		const city = await this.cityRepository.find(userId);
		if (!city) {
			// NOTE: Reject if the user is not in any city.
			this.presenter.addText("You are not in any city.");
			return;
		}

		const reply = await this.npc.talk(city, message);
		this.presenter.addText(reply);

		city.refresh();
		await this.cityRepository.save(city);
	}
}
