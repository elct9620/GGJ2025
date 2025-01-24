import { injectable } from "tsyringe-neo";

import { EmailController, EmailParams } from "./EmailController";

@injectable()
export class NewGameController extends EmailController {
	protected async onMessage(params: EmailParams): Promise<void> {
		// Do something with the email
	}
}
