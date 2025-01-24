import {
	addBreadcrumb,
	SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
	setMeasurement,
	startSpan,
} from "@sentry/cloudflare";
import { generateText, ToolExecutionOptions } from "ai";

function applyToolExecuteBreadcrumb(
	toolName: string,
	execute: (args: any, options: ToolExecutionOptions) => PromiseLike<any>,
) {
	return new Proxy(execute, {
		apply(target, thisArg, args: Parameters<typeof execute>) {
			return target.apply(thisArg, args).then((result) => {
				addBreadcrumb({
					type: "debug",
					category: "ai.tool",
					data: {
						name: toolName,
						result,
					},
				});

				return result;
			});
		},
	});
}

export async function trackGenerateText(
	name: string,
	...args: Parameters<typeof generateText>
): ReturnType<typeof generateText> {
	const [input] = args;
	input.headers = {
		...(input.headers || {}),
		"cf-aig-metadata": JSON.stringify({
			revision: GIT_COMMIT_SHA,
		}),
	};

	for (const [name, tool] of Object.entries(input.tools || {})) {
		if (!tool.execute) {
			continue;
		}

		tool.execute = applyToolExecuteBreadcrumb(name, tool.execute);
	}

	return await startSpan(
		{
			op: "ai.pipeline",
			name,
			attributes: {
				[SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.ai.openai",
				"ai.pipeline.name": name,
				"ai.model_id": input.model.modelId,
				"ai.input_messages": JSON.stringify(input.messages || [input.prompt]),
			},
		},
		async (span) => {
			const reply = await generateText(input);

			setMeasurement(
				"ai_prompt_tokens_used",
				reply.usage.promptTokens,
				"",
				span,
			);
			setMeasurement(
				"ai_completion_tokens_used",
				reply.usage.completionTokens,
				"",
				span,
			);
			setMeasurement("ai_total_tokens_used", reply.usage.totalTokens, "", span);

			span.setAttributes({
				"ai.completion_tokens.used": reply.usage.completionTokens,
				"ai.prompt_tokens.used": reply.usage.promptTokens,
				"ai.total_tokens.used": reply.usage.totalTokens,
				"ai.responses": reply.text,
			});

			return reply;
		},
	);
}
