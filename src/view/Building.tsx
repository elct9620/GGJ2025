/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";

export const Building: FC = ({ className, src, title }) => {
	return (
		<div>
			<img class={className} src={src} alt={title} />
		</div>
	);
};
