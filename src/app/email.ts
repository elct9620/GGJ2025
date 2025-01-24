import { captureException, setUser, startSpan } from "@sentry/cloudflare";
import { getContainer } from "./container";
import { routes } from "./routes/email";
import { sha256 } from "./utils";

const MAX_EMAIL_AGE = 1000 * 60 * 60 * 24; // 1 day

function ensureNotExpiredEmail(
	message: ForwardableEmailMessage,
	maxAge: number,
) {
	const dateStr = message.headers.get("Date");
	if (!dateStr) {
		throw new Error("Email has no date header");
	}

	const date = new Date(dateStr);
	if (isNaN(date.getTime())) {
		throw new Error("Invalid date header");
	}

	const now = new Date();
	const diff = now.getTime() - date.getTime();
	if (diff > maxAge) {
		throw new Error("Email is too old");
	}
}

export async function email(
	message: ForwardableEmailMessage,
	env: Env,
	ctx: ExecutionContext,
) {
	const userId = await sha256(message.from);
	setUser({ id: userId });

	try {
		ensureNotExpiredEmail(message, MAX_EMAIL_AGE);
	} catch (e) {
		if (e instanceof Error) {
			message.setReject(e.message);
		} else {
			message.setReject("Unknown error");
		}
		return;
	}

	const [route, domain] = message.to.split("@");
	const routeHandler = routes[route];
	if (!routeHandler) {
		message.setReject("No route found");
		return;
	}

	const container = getContainer(env);
	const controller = container.resolve(routeHandler);

	await startSpan(
		{
			op: "email",
			name: `${controller.constructor.name}.handle(${message.headers.get("Message-ID")})`,
		},
		async (span) => {
			await controller.handle(userId, message);
		},
	);
}
