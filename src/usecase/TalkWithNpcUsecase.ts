import { CityRepository, EmailPresenter, Npc } from "./interface";

export class TaklWithNpcUsecase {
	constructor(
		private readonly presenter: EmailPresenter,
		private readonly cityRepository: CityRepository,
		private readonly npc: Npc,
	) {}

	async execute(userId: string, content: string): Promise<void> {
		const city = await this.cityRepository.find(userId);
		if (!city) {
			// NOTE: Reject if the user is not in any city.
			this.presenter.addText("You are not in any city.");
			return;
		}

		city.refresh();
		city.addConversation(this.npc.name, { role: "user", content });

		const reply = await this.npc.talk(city);
		this.presenter.addText(reply);

		await this.cityRepository.save(city);
	}
}
