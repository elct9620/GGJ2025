/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";

export const Npc: FC = ({ className, title }) => {
	return (
		<div class={className}>
			<img src={"/" + title + ".png"} alt={title} />
		</div>
	);
};
