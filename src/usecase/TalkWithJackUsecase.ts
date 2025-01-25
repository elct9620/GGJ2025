import { CityRepository, EmailPresenter } from "./interface";

export class TaklWithJackUsecase {
	constructor(
		private readonly presenter: EmailPresenter,
		private readonly cityRepository: CityRepository,
	) {}

	async execute(userId: string, message: string): Promise<void> {
		await this.cityRepository.destroy(userId);
		this.presenter.addText("Hello, I'm Jack.");
	}
}
