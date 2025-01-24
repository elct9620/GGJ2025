import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { startSpan } from "@sentry/cloudflare";
import { createMimeMessage, MIMEMessage } from "mimetext/browser";

export interface MailSettings {
	messageId: string;
	references?: string;
	subject: string;
	sender: string;
	recipients: string[];
}

export class SesEmailPresenter {
	private readonly message: MIMEMessage = createMimeMessage();

	constructor(
		private readonly ses: SESv2Client,
		private readonly settings: MailSettings,
	) {
		this.message.setSender(settings.sender);
		this.message.setRecipients(settings.recipients);
		this.message.setHeader("In-Reply-To", settings.messageId);
		this.message.setHeader(
			"References",
			`${settings.references} ${settings.messageId}`,
		);

		if (settings.subject.includes("Re:")) {
			this.message.setSubject(settings.subject);
		} else {
			this.message.setSubject(`Re: ${settings.subject}`);
		}
	}

	addText(message: string) {
		this.message.addMessage({
			contentType: "text/plain",
			data: message,
		});
	}

	async render() {
		return startSpan(
			{
				op: "presenter.render",
				name: "SesEmailPresenter#render",
			},
			async () => {
				return this.ses.send(
					new SendEmailCommand({
						FromEmailAddress: this.settings.sender,
						Destination: {
							ToAddresses: this.settings.recipients,
						},
						Content: {
							Raw: {
								Data: Buffer.from(this.message.asRaw(), "utf-8"),
							},
						},
					}),
				);
			},
		);
	}
}
