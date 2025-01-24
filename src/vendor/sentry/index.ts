import {
	EmailExportedHandler,
	ExportedHandler,
} from "@cloudflare/workers-types";
import {
	captureException,
	CloudflareClient,
	CloudflareOptions,
	flush,
	getDefaultIntegrations,
	Scope,
	withSentry as sdkWithSentry,
	SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
	SEMANTIC_ATTRIBUTE_SENTRY_SOURCE,
	startSpan,
	withIsolationScope,
} from "@sentry/cloudflare";
import {
	getIntegrationsToSetup,
	initAndBind,
	stackParserFromStackParserOptions,
} from "@sentry/core";
import { defaultStackParser } from "./stacktrace";
import { makeCloudflareTransport } from "./transport";

type ExtractEnv<P> = P extends ExportedHandler<infer Env> ? Env : never;

function init(options: CloudflareOptions): CloudflareClient | undefined {
	if (options.defaultIntegrations === undefined) {
		options.defaultIntegrations = getDefaultIntegrations(options);
	}

	return initAndBind(CloudflareClient, {
		...options,
		stackParser: stackParserFromStackParserOptions(
			options.stackParser || defaultStackParser,
		),
		integrations: getIntegrationsToSetup(options),
		transport: options.transport || makeCloudflareTransport,
	}) as CloudflareClient;
}

function addCloudResourceContext(scope: Scope): void {
	scope.setContext("cloud_resource", {
		"cloud.provider": "cloudflare",
	});
}

export function withSentry<E extends ExportedHandler<any>>(
	optionsCallback: (env: ExtractEnv<E>) => CloudflareOptions,
	handler: E,
): E {
	if ("email" in handler && typeof handler.email === "function") {
		handler.email = new Proxy(handler.email, {
			apply(
				target,
				thisArg,
				args: Parameters<EmailExportedHandler<ExtractEnv<E>>>,
			) {
				const [event, env, context] = args;
				return withIsolationScope((isolationScope) => {
					const options = optionsCallback(env);
					const client = init(options);
					isolationScope.setClient(client);

					addCloudResourceContext(isolationScope);

					return startSpan(
						{
							op: "other", // NOTE: following OTEL conventions
							name: `Email route to ${event.to}`,
							attributes: {
								"faas.trigger": "other",
								[SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.faas.cloudflare",
								[SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "custom",
							},
						},
						async () => {
							try {
								return await (target.apply(thisArg, args) as ReturnType<
									typeof target
								>);
							} catch (e) {
								captureException(e, {
									mechanism: { handled: false, type: "cloudflare" },
								});
								throw e;
							} finally {
								context.waitUntil(flush(2000));
							}
						},
					);
				});
			},
		});
		markAsInstrumented(handler.email);
	}

	return sdkWithSentry(optionsCallback, handler);
}

type SentryInstrumented<T> = T & {
	__SENTRY_INSTRUMENTED__?: boolean;
};

function markAsInstrumented<T>(handler: T): void {
	try {
		(handler as SentryInstrumented<T>).__SENTRY_INSTRUMENTED__ = true;
	} catch {
		// ignore errors here
	}
}

function isInstrumented<T>(handler: T): boolean | undefined {
	try {
		return (handler as SentryInstrumented<T>).__SENTRY_INSTRUMENTED__;
	} catch {
		return false;
	}
}
