interface Controller {
	handle(userId: string, message: ForwardableEmailMessage): Promise<void>;
}

type Routes = {
	[key: string]: new (...args: any[]) => Controller;
};

export const routes: Routes = {};
