/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";

import { type CitySnapshot } from "@usecase/CitySnapshotUsecase";
import { Layout } from "./Layout";
import { Building } from "./Building";
import { Npc } from "./Npc";
import { css } from "hono/css";

const container = css`
	width: 768px;
	position: relative;
	transform: scale(0.65) translateX(-28%) translateY(-27%);
`;

export const City: FC<CitySnapshot> = ({ id, damage }) => {
	return (
		<Layout>
			<div class={container}>
				<img src="/bg.png" alt="baseCity" />
				<Building title="shell" bottom="33%" left="40%" damage={damage} />
				<Building title="factory" bottom="46%" left="7%" damage={damage} />
				<Building title="hospital" bottom="46%" left="54%" damage={damage} />
				<Npc title="doctor" bottom="45%" left="42%" />
				<Building title="office" bottom="35%" left="0%" damage={damage} />
				<Npc title="engineer" bottom="33%" left="15%" />
				<Building title="people" bottom="34%" left="60.5%" damage={damage} />
				<Npc title="politician" bottom="33%" left="58%" />
			</div>
		</Layout>
	);
};
