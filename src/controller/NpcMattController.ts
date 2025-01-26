import { inject, injectable } from "tsyringe-neo";

import { NpcController } from "./NpcController";
import { SESv2Client } from "@aws-sdk/client-sesv2";
import { SesEmailPresenter } from "@presenter/SesEmailPresenter";
import { KvCityRepository } from "@repository/KvCityRepository";
import { TaklWithNpcUsecase } from "@usecase/TalkWithNpcUsecase";
import { EndMessageBuilder } from "@builder/EndMessageBuilder";
import { ProgressBuilder } from "@builder/ProgressBuilder";
import { NpcName } from "@entity/Npc";
import { NpcMary } from "@agent/NpcMary";
import { NpcMatt } from "@agent/NpcMatt";

@injectable()
export class NpcMattController extends NpcController {
	constructor(
		@inject(SESv2Client) ses: SESv2Client,
		@inject(KvCityRepository) cityRepository: KvCityRepository,
		@inject(EndMessageBuilder) endMessageBuilder: EndMessageBuilder,
		@inject(ProgressBuilder) progressBuilder: ProgressBuilder,
		@inject(NpcMatt) public readonly npc: NpcMatt,
	) {
		super(ses, cityRepository, endMessageBuilder, progressBuilder);
	}

	public get senderName(): string {
		return NpcName.Matt;
	}
}
