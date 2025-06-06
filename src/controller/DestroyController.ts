import { inject, injectable } from "tsyringe-neo";

import { SESv2Client } from "@aws-sdk/client-sesv2";
import { SesEmailPresenter } from "@presenter/SesEmailPresenter";
import { KvCityRepository } from "@repository/KvCityRepository";
import { DestroyUsecase } from "@usecase/DestroyUsecase";
import { EmailController, EmailParams } from "./EmailController";

@injectable()
export class DestroyController extends EmailController {
	public static readonly SenderName: string = "Atlantis";

	constructor(
		@inject(SESv2Client) private readonly ses: SESv2Client,
		@inject(KvCityRepository) private readonly cityRepository: KvCityRepository,
	) {
		super();
	}

	protected async onMessage(params: EmailParams): Promise<void> {
		var sender = params.to;
		if (!sender.includes("<")) {
			sender = `${DestroyController.SenderName} <${sender}>`;
		}

		const presenter = new SesEmailPresenter(this.ses, {
			sender,
			recipients: [params.from],
			messageId: params.messageId,
			references: params.references,
			subject: params.subject,
		});

		const usecase = new DestroyUsecase(presenter, this.cityRepository);
		await usecase.execute(params.userId);
		await presenter.render();
	}
}
