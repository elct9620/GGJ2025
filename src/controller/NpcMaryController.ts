import { inject, injectable } from "tsyringe-neo";

import { NpcMary } from "@agent/NpcMary";
import { SESv2Client } from "@aws-sdk/client-sesv2";
import { EndMessageBuilder } from "@builder/EndMessageBuilder";
import { ProgressBuilder } from "@builder/ProgressBuilder";
import { NpcName } from "@entity/Npc";
import { KvCityRepository } from "@repository/KvCityRepository";
import { NpcController } from "./NpcController";

@injectable()
export class NpcMaryController extends NpcController {
	constructor(
		@inject(SESv2Client) ses: SESv2Client,
		@inject(KvCityRepository) cityRepository: KvCityRepository,
		@inject(EndMessageBuilder) endMessageBuilder: EndMessageBuilder,
		@inject(ProgressBuilder) progressBuilder: ProgressBuilder,
		@inject(NpcMary) public readonly npc: NpcMary,
	) {
		super(ses, cityRepository, endMessageBuilder, progressBuilder);
	}

	public get senderName(): string {
		return NpcName.Mary;
	}
}
