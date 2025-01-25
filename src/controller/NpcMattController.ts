import { inject, injectable } from "tsyringe-neo";

import { EmailController, EmailParams } from "./EmailController";
import { SESv2Client } from "@aws-sdk/client-sesv2";
import { SesEmailPresenter } from "@presenter/SesEmailPresenter";
import { KvCityRepository } from "@repository/KvCityRepository";

@injectable()
export class NpcMattController extends EmailController {
	public static readonly SenderName: string = "Matt";

	constructor(
		@inject(SESv2Client) private readonly ses: SESv2Client,
		@inject(KvCityRepository) private readonly cityRepository: KvCityRepository,
	) {
		super();
	}

	protected async onMessage(params: EmailParams): Promise<void> {
		var sender = params.to;
		if (!sender.includes("<")) {
			sender = `${NpcMattController.SenderName} <${sender}>`;
		}

		const presenter = new SesEmailPresenter(this.ses, {
			sender,
			recipients: [params.from],
			messageId: params.messageId,
			references: params.references,
			subject: params.subject,
		});

		presenter.addText("Hello, I'm Matt.");
		await presenter.render();
	}
}
