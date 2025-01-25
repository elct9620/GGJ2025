/** @jsxImportSource hono/jsx */

import { FC } from "hono/jsx";

import { type CitySnapshot } from "@usecase/CitySnapshotUsecase";
import { Layout } from "./Layout";
import { css, cx } from 'hono/css'

const pRelative = css`
	position: relative;
`

const pAbsolute = css`
	position: absolute;
`

const container = css`
	display: flex;
	width: 768px;
`

const shell = css`
	bottom: 33%;
	left: 40%;
`

const factory = css`
	bottom: 46%;
    left: 7%;
`

const hospital = css`
	bottom: 46%;
	right: 5%;
`

const office = css`
	bottom: 35%;
	left: 0%;
`

const people = css`
	bottom: 34%;
	right: 0%;
`

export const City: FC<CitySnapshot> = ({ id }) => {
	return (
		<Layout>
			<div class={cx(container, pRelative)}>
				<img src="/bg.png" alt="mainCity"/>
				<div class={cx(pAbsolute, shell)}>
					<img src="/shell_0.png" alt="shell" />
				</div>
				<div class={cx(pAbsolute, factory)}>
					<img src="/factory_0.png" alt="factory" />
				</div>
				<div class={cx(pAbsolute, hospital)}>
					<img src="/hospital_0.png" alt="hospital" />
				</div>
				<div class={cx(pAbsolute, office)}>
					<img src="/office_0.png" alt="office" />
				</div>
				<div class={cx(pAbsolute, people)}>
					<img src="/people_0.png" alt="people" />
				</div>
			</div>
		</Layout>
	);
};
