/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";

import { type CitySnapshot } from "@usecase/CitySnapshotUsecase";
import { Layout } from "./Layout";
import { Building } from "./Building";
import { css, cx } from "hono/css";

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

export const City: FC<CitySnapshot> = ({ id }) => {
	return (
		<Layout>
			<div class={cx(container, pRelative)}>
				<img src="/bg.png" alt="baseCity" />
				<Building
					className={cx(pAbsolute, shell)}
					src="/shell_0.png"
					title="shell"
				/>
				<Building
					className={cx(pAbsolute, factory)}
					src="/factory_0.png"
					title="factory"
				/>
				<Building
					className={cx(pAbsolute, hospital)}
					src="/hospital_0.png"
					title="hospital"
				/>
				<Building
					className={cx(pAbsolute, office)}
					src="/office_0.png"
					title="office"
				/>
				<Building
					className={cx(pAbsolute, people)}
					src="/people_0.png"
					title="people"
				/>
			</div>
		</Layout>
	);
};
