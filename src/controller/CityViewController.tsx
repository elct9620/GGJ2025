/** @jsx jsx */
/** @jsxImportSource hono/jsx */

import { injectable } from "tsyringe-neo";

@injectable()
export class CityViewController {
	async handle(id: string) {
		return <div>CityId - {id}</div>;
	}
}
