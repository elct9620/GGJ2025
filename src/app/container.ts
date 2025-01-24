import { SESv2Client } from "@aws-sdk/client-sesv2";
import {
	container,
	DependencyContainer,
	instanceCachingFactory,
} from "tsyringe-neo";

import { Config } from "./config";

container.register(SESv2Client, {
	useFactory: instanceCachingFactory((c) => {
		const config = c.resolve<Config>(Config);

		return new SESv2Client({
			region: "ap-northeast-1",
			credentials: {
				accessKeyId: config.awsAccessKeyId,
				secretAccessKey: config.awsSecretAccessKey,
			},
		});
	}),
});

export function getContainer(env: Env): DependencyContainer {
	const c = container.createChildContainer();

	c.register(Config, {
		useValue: new Config(env.AWS_ACCESS_KEY_ID, env.AWS_SECRET_ACCESS_KEY),
	});

	return c;
}
