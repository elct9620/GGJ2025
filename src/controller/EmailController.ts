import EmailReplyParser from "email-reply-parser";
import PostalMime from "postal-mime";

export type EmailParams = {
	userId: string;
	from: string;
	to: string;
	messageId: string;
	references?: string;
	subject: string;
	body: string;
	headers: Record<string, string>;
};

export abstract class EmailController {
	async handle(userId: string, message: ForwardableEmailMessage) {
		const params = await this.buildParams(userId, message);

		return await this.onMessage(params);
	}

	protected abstract onMessage(params: EmailParams): Promise<void>;

	private async buildParams(
		userId: string,
		message: ForwardableEmailMessage,
	): Promise<EmailParams> {
		const mail = await PostalMime.parse(message.raw);
		const replyParser = new EmailReplyParser();
		const body = replyParser.read(mail.text || "").getVisibleText();
		const headers: Record<string, string> = {};

		for (const [key, value] of message.headers.entries()) {
			headers[key] = value;
		}

		return {
			userId,
			from: message.from,
			to: message.to,
			messageId: mail.messageId,
			references: mail.references,
			subject: mail.subject || "",
			body,
			headers,
		};
	}
}
