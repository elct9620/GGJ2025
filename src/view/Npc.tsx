/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";
import { css } from "hono/css";

const caculateFavorability = function (favorability: number) {
	if (favorability <= 30) return "_mad.png";
	if (favorability >= 90) return "_joy.png";
	return ".png";
};

export const Npc: FC = (prop) => {
	const position = css`
		position: absolute;
		bottom: ${prop.bottom};
		left: ${prop.left};
	`;
	return (
		<div class={position}>
			<img
				src={"/" + prop.title + caculateFavorability(prop.favorability)}
				alt={prop.title}
			/>
		</div>
	);
};
