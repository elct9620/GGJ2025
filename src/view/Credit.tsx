/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";
import { Style, css } from "hono/css";

export const Credit: FC = () => {
	const container = css`
		transform: scale(0.7);
		transform-origin: top left;
		width: 768px;
	`;
	return (
		<div class={container} onclick="history.back(1);">
			<Style />
			<img src="/credit_all.png" alt="credit" />
		</div>
	);
};
