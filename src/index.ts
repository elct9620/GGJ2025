import "reflect-metadata";

import { withSentry } from "./vendor/sentry";
import { email } from "@app/email";
import app from "@app/web";

export default withSentry(
	(env) => ({
		dsn: env.SENTRY_DSN,
		release: GIT_COMMIT_SHA,
		tracesSampleRate: 1.0,
	}),
	{
		fetch: app.fetch,
		email,
	} satisfies ExportedHandler<Env>,
);
