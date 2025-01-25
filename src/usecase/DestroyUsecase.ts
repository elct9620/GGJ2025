import { CityRepository, EmailPresenter } from "./interface";

export class DestroyUsecase {
	constructor(
		private readonly presenter: EmailPresenter,
		private readonly cityRepository: CityRepository,
	) {}

	async execute(userId: string): Promise<void> {
		await this.cityRepository.destroy(userId);
		this.presenter.addText("City destroyed");
	}
}
