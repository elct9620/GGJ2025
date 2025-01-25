/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";
import { css, cx } from "hono/css";

const caculateDamaged = function (damage: number) {
	if (damage < 25) return "_0.png";
	if (damage < 50) return "_1.png";
	if (damage < 75) return "_2.png";
	return "_3.png";
};

export const Building: FC = (prop) => {
	const position = css`
		position: absolute;
		bottom: ${prop.bottom};
		left: ${prop.left};
	`;
	return (
		<div class={position}>
			<img
				src={"/" + prop.title + caculateDamaged(prop.damage)}
				alt={prop.title}
			/>
		</div>
	);
};
