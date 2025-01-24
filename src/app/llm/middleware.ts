import {
	LanguageModelV1FilePart,
	LanguageModelV1ImagePart,
	LanguageModelV1Message,
	LanguageModelV1TextPart,
	LanguageModelV1ToolCallPart,
	LanguageModelV1ToolResultPart,
} from "@ai-sdk/provider";
import type { Experimental_LanguageModelV1Middleware as LanguageModelV1Middleware } from "ai";

import { addBreadcrumb, setMeasurement, startSpan } from "@sentry/cloudflare";

function convertPrompt(prompt: LanguageModelV1Message): Record<string, any> {
	switch (prompt.role) {
		case "system":
			return { role: "system", content: prompt.content };
		case "user":
			return prompt.content.map(convertUserContent);
		case "assistant":
			return prompt.content.map(convertAssistantContent);
		case "tool":
			return prompt.content.map(convertToolContent);
	}

	return prompt;
}

function convertUserContent(
	content:
		| LanguageModelV1TextPart
		| LanguageModelV1ImagePart
		| LanguageModelV1FilePart,
) {
	switch (content.type) {
		case "text":
			return { role: "user", type: "text", text: content.text };
		case "image":
			return { role: "user", type: "image", url: content.image };
		case "file":
			return { role: "user", type: "file", url: content.data };
	}
}

function convertAssistantContent(
	content: LanguageModelV1TextPart | LanguageModelV1ToolCallPart,
) {
	switch (content.type) {
		case "text":
			return { role: "assistant", type: "text", text: content.text };
		case "tool-call":
			return {
				role: "assistant",
				type: "tool-call",
				name: content.toolName,
				args: content.args,
			};
	}
}

function convertToolContent(content: LanguageModelV1ToolResultPart) {
	return {
		toolName: content.toolName,
		result: content.result,
	};
}

export const LlmBreadcrumb: LanguageModelV1Middleware = {
	wrapGenerate: async ({ doGenerate, params }) => {
		const result = await startSpan(
			{
				op: "ai.run",
				name: "@ai-sdk/doGenerate",
			},
			async (span) => {
				const res = await doGenerate();

				setMeasurement(
					"ai_prompt_tokens_used",
					res.usage.promptTokens,
					"",
					span,
				);
				setMeasurement(
					"ai_completion_tokens_used",
					res.usage.completionTokens,
					"",
					span,
				);

				span.setAttributes({
					"ai.completion_tokens.used": res.usage.completionTokens,
					"ai.prompt_tokens.used": res.usage.promptTokens,
					"ai.responses": res.text,
				});

				return res;
			},
		);

		addBreadcrumb({
			type: "debug",
			category: "ai.chat_completions.create",
			data: {
				finishReason: result.finishReason,
				toolCalls: result.toolCalls?.map((tc) => ({
					name: tc.toolName,
					args: tc.args,
				})),
				text: result.text,
				mode: params.mode,
				temperature: params.temperature,
				inputFormat: params.inputFormat,
				prompts: params.prompt.flatMap(convertPrompt),
			},
		});

		return result;
	},
};
