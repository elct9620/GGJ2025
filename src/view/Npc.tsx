/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";
import { css } from "hono/css";

export const Npc: FC = (prop) => {
	const position = css`
		position: absolute;
		bottom: ${prop.bottom};
		left: ${prop.left};
	`;
	return (
		<div class={position}>
			<img src={"/" + prop.title + ".png"} alt={prop.title} />
		</div>
	);
};
