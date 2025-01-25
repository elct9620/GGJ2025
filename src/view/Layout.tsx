/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";
import { Style } from "hono/css";

export const Layout: FC = ({ children }) => {
	return (
		<html>
			<head>
				<title>Atlantis</title>
				<Style />
			</head>
			<body>{children}</body>
		</html>
	);
};
