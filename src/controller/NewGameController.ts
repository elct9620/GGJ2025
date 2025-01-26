import { inject, injectable } from "tsyringe-neo";

import { GuideAgent } from "@agent/GuideAgent";
import { SESv2Client } from "@aws-sdk/client-sesv2";
import { EndMessageBuilder } from "@builder/EndMessageBuilder";
import { WelcomeMessageBuilder } from "@builder/WelcomeMessageBuilder";
import { SesEmailPresenter } from "@presenter/SesEmailPresenter";
import { KvCityRepository } from "@repository/KvCityRepository";
import { GuideUsecase } from "@usecase/GuideUsecase";
import { EmailController, EmailParams } from "./EmailController";

@injectable()
export class NewGameController extends EmailController {
	public static readonly SenderName: string = "Atlantis";

	constructor(
		@inject(SESv2Client) private readonly ses: SESv2Client,
		@inject(GuideAgent) private readonly agent: GuideAgent,
		@inject(KvCityRepository) private readonly cityRepository: KvCityRepository,
		@inject(WelcomeMessageBuilder)
		private readonly welcomeMessageBuilder: WelcomeMessageBuilder,
		@inject(EndMessageBuilder)
		private readonly endMessageBuilder: EndMessageBuilder,
	) {
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
		const usecase = new GuideUsecase(
			presenter,
			this.welcomeMessageBuilder,
			this.endMessageBuilder,
			this.agent,
			this.cityRepository,
		);

		await usecase.execute(params.userId, params.body);
		await presenter.render();
	}
}
