export interface EmailPresenter {
	addText(text: string): void;
}

export interface Agent {
	talk(prompt: string): Promise<string>;
}
