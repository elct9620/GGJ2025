/** @jsxImportSource hono/jsx */

import { css } from "hono/css";
import { FC } from "hono/jsx";

const caculateDamaged = function (damage: number) {
	if (damage < 30) return "_0.png";
	if (damage < 70) return "_1.png";
	return "_2.png";
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
