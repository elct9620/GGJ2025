/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";

import { type CitySnapshot } from "@usecase/CitySnapshotUsecase";
import { Layout } from "./Layout";
import { Building } from "./Building";
import { Npc } from "./Npc";
import { css, cx } from "hono/css";

const responsive = css`
	@media only screen and (max-width: 768px) {
		transform: scale(0.65) translateX(-28%) translateY(-27%);
	}
`;

const pRelative = css`
	position: relative;
`;

const pAbsolute = css`
	position: absolute;
`;

const container = css`
	display: flex;
	width: 768px;
`;

const shell = css`
	bottom: 33%;
	left: 40%;
`;

const factory = css`
	bottom: 46%;
	left: 7%;
`;

const hospital = css`
	bottom: 46%;
	right: 5%;
`;

const office = css`
	bottom: 35%;
	left: 0%;
`;

const people = css`
	bottom: 34%;
	right: 0%;
`;

const doctor = css`
	left: 42%;
	top: 40%;
`;

const engineer = css`
	left: 15%;
	bottom: 33%;
`;

const politician = css`
	right: 18%;
	bottom: 33%;
`;

export const City: FC<CitySnapshot> = ({ id, damage }) => {
	return (
		<Layout>
			<div class={cx(container, pRelative, responsive)}>
				<img src="/bg.png" alt="baseCity" />
				<Building
					className={cx(pAbsolute, shell)}
					title="shell"
					damage={damage}
				/>
				<Building
					className={cx(pAbsolute, factory)}
					title="factory"
					damage={damage}
				/>
				<Building
					className={cx(pAbsolute, hospital)}
					title="hospital"
					damage={damage}
				/>
				<Npc className={cx(pAbsolute, doctor)} title="doctor" />
				<Building
					className={cx(pAbsolute, office)}
					title="office"
					damage={damage}
				/>
				<Npc className={cx(pAbsolute, engineer)} title="engineer" />
				<Building
					className={cx(pAbsolute, people)}
					title="people"
					damage={damage}
				/>
				<Npc className={cx(pAbsolute, politician)} title="politician" />
			</div>
		</Layout>
	);
};
