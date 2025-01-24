import { EmailPresenter, Agent } from "./interface";

export class GuideUsecase {
	constructor(
		private readonly presenter: EmailPresenter,
		private readonly agent: Agent,
	) {}

	async execute(message: string): Promise<void> {
		const reply = await this.agent.talk(message);
		this.presenter.addText(reply);
	}
}
