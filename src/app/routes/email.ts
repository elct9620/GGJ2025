import { DestroyController } from "@controller/DestroyController";
import { NewGameController } from "@controller/NewGameController";
import { NpcJackController } from "@controller/NpcJackController";

interface Controller {
	handle(userId: string, message: ForwardableEmailMessage): Promise<void>;
}

type Routes = {
	[key: string]: new (...args: any[]) => Controller;
};

export const routes: Routes = {
	new: NewGameController,
	destroy: DestroyController,
	jack: NpcJackController,
};
