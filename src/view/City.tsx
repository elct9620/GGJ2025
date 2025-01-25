/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";

import { type CitySnapshot } from "@usecase/CitySnapshotUsecase";
import { Layout } from "./Layout";

export const City: FC<CitySnapshot> = ({ id }) => {
	return (
		<Layout>
			<div>City - {id}</div>
		</Layout>
	);
};
