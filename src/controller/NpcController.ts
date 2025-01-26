import { SESv2Client } from "@aws-sdk/client-sesv2";
import { EndMessageBuilder } from "@builder/EndMessageBuilder";
import { ProgressBuilder } from "@builder/ProgressBuilder";
import { SesEmailPresenter } from "@presenter/SesEmailPresenter";
import { KvCityRepository } from "@repository/KvCityRepository";
import { Npc } from "@usecase/interface";
import { TaklWithNpcUsecase } from "@usecase/TalkWithNpcUsecase";
import { EmailController, EmailParams } from "./EmailController";

export abstract class NpcController extends EmailController {
	constructor(
		private readonly ses: SESv2Client,
		private readonly cityRepository: KvCityRepository,
		private readonly endMessageBuilder: EndMessageBuilder,
		private readonly progressBuilder: ProgressBuilder,
	) {
		super();
	}

	public abstract get senderName(): string;
	abstract get npc(): Npc;

	protected async onMessage(params: EmailParams): Promise<void> {
		var sender = params.to;
		if (!sender.includes("<")) {
			sender = `${this.senderName} <${sender}>`;
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
