import "reflect-metadata";

import { withSentry } from "./vendor/sentry";
import { email } from "@app/email";

export default withSentry(
	(env) => ({
		dsn: env.SENTRY_DSN,
		release: GIT_COMMIT_SHA,
		tracesSampleRate: 1.0,
	}),
	{
		async fetch(request, env, ctx): Promise<Response> {
			return new Response("Hello World!");
		},
		email,
	} satisfies ExportedHandler<Env>,
);
