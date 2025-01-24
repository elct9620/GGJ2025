import { inject, injectable } from "tsyringe-neo";

import { EmailController, EmailParams } from "./EmailController";
import { SesEmailPresenter } from "@presenter/SesEmailPresenter";
import { SESv2Client } from "@aws-sdk/client-sesv2";
import { GuideUsecase } from "@usecase/GuideUsecase";

@injectable()
export class NewGameController extends EmailController {
	public static readonly SenderName: string = "Atlantis";

	constructor(@inject(SESv2Client) private readonly ses: SESv2Client) {
		super();
	}

	protected async onMessage(params: EmailParams): Promise<void> {
		var sender = params.to;
		if (!sender.includes("<")) {
			sender = `${NewGameController.SenderName} <${sender}>`;
		}

		const presenter = new SesEmailPresenter(this.ses, {
			sender,
			recipients: [params.from],
			messageId: params.messageId,
			references: params.references,
			subject: params.subject,
		});
		const usecase = new GuideUsecase(presenter);

		await usecase.execute();
		await presenter.render();
	}
}
