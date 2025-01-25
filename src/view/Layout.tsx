/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";

export const Layout: FC = ({ children }) => {
	return (
		<html>
			<body>{children}</body>
		</html>
	);
};
