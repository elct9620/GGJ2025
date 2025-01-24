import { EmailPresenter } from "./interface";

export class GuideUsecase {
	constructor(private readonly presenter: EmailPresenter) {}

	async execute() {
		this.presenter.addText("This is game guide");
	}
}
