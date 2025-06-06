/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";

import { type CitySnapshot } from "@usecase/CitySnapshotUsecase";
import { css } from "hono/css";
import { Building } from "./Building";
import { Layout } from "./Layout";
import { Npc } from "./Npc";

const container = css`
	width: 768px;
	position: relative;
	transform: scale(0.65) translateX(-28%) translateY(-27%);
`;

const button = css`
	font-family: "Courier New", monospace;
	position: absolute;
	border: 0;
	background-color: transparent;
	top: 83%;
	right: 0%;
	font-size: 34pt;
	cursor: pointer;
	color: black;
	font-weight: bold;
	transition: color 0.3s;
	&:hover {
		color: red;
	}
`;

const caculateDamaged = function (damage: number) {
	if (damage < 30) return "_0.png";
	if (damage < 70) return "_1.png";
	return "_2.png";
};

export const City: FC<CitySnapshot> = ({ id, damage, npcStatus }) => {
	return (
		<Layout>
			<div class={container}>
				<img src={"/bg" + caculateDamaged(damage)} alt="baseCity" />
				<Building title="shell" bottom="33%" left="40%" damage={damage} />
				<Building title="factory" bottom="46%" left="7%" damage={damage} />
				<Building title="hospital" bottom="46%" left="54%" damage={damage} />
				<Npc
					title="doctor"
					bottom="45%"
					left="42%"
					favorability={npcStatus.Mary.favorability}
				/>
				<Building title="office" bottom="35%" left="0%" damage={damage} />
				<Npc
					title="engineer"
					bottom="33%"
					left="15%"
					favorability={npcStatus.Jack.favorability}
				/>
				<Building title="people" bottom="34%" left="60.5%" damage={damage} />
				<Npc
					title="politician"
					bottom="33%"
					left="58%"
					favorability={npcStatus.Matt.favorability}
				/>
				<button onclick="location.href='/credit'" class={button}>
					- Credit -
				</button>
			</div>
		</Layout>
	);
};
