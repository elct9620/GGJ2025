/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";

const caculateDamaged = function (damage: number) {
	if (damage < 25) return "_0.png";
	if (damage < 50) return "_1.png";
	if (damage < 75) return "_2.png";
	if (damage < 100) return "_3.png";
};

export const Building: FC = ({ className, title, damage }) => {
	return (
		<div class={className}>
			<img src={"/" + title + caculateDamaged(damage)} alt={title} />
		</div>
	);
};
