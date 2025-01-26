import { inject, injectable } from "tsyringe-neo";

import { EmailController, EmailParams } from "./EmailController";
import { SESv2Client } from "@aws-sdk/client-sesv2";
import { SesEmailPresenter } from "@presenter/SesEmailPresenter";
import { KvCityRepository } from "@repository/KvCityRepository";
import { TaklWithNpcUsecase } from "@usecase/TalkWithNpcUsecase";
import { NpcJack } from "@agent/NpcJack";
import { EndMessageBuilder } from "@builder/EndMessageBuilder";
import { ProgressBuilder } from "@builder/ProgressBuilder";

@injectable()
export class NpcJackController extends EmailController {
	public static readonly SenderName: string = "Jack";

	constructor(
		@inject(SESv2Client) private readonly ses: SESv2Client,
		@inject(KvCityRepository) private readonly cityRepository: KvCityRepository,
		@inject(NpcJack) private readonly npc: NpcJack,
		@inject(EndMessageBuilder)
		private readonly endMessageBuilder: EndMessageBuilder,
		@inject(ProgressBuilder) private readonly progressBuilder: ProgressBuilder,
	) {
		super();
	}

	protected async onMessage(params: EmailParams): Promise<void> {
		var sender = params.to;
		if (!sender.includes("<")) {
			sender = `${NpcJackController.SenderName} <${sender}>`;
		}

		const presenter = new SesEmailPresenter(this.ses, {
			sender,
			recipients: [params.from],
			messageId: params.messageId,
			references: params.references,
			subject: params.subject,
		});
		const usecase = new TaklWithNpcUsecase(
			presenter,
			this.endMessageBuilder,
			this.progressBuilder,
			this.cityRepository,
			this.npc,
		);

		await usecase.execute(params.userId, params.body);
		await presenter.render();
	}
}
