/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";
import { css, Style } from "hono/css";

const globalClass = css`
	:-hono-global {
		html {
			overflow-y: hidden;
		}
	}
`;

export const Layout: FC = ({ children }) => {
	return (
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Atlantis</title>
				<Style />
			</head>
			<body class={globalClass}>{children}</body>
		</html>
	);
};
