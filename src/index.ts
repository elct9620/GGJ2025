import "reflect-metadata";

import { withSentry } from "./vendor/sentry";

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
		async email(message, env, ctx) {
			return;
		},
	} satisfies ExportedHandler<Env>,
);
