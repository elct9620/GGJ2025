import { tool } from "ai";
import { z } from "zod";

import { City } from "@entity/City";

export function canCloseValve(city: City) {
	return tool({
		description:
			"Try to close the valve, if closed or not reached the condition, it will return false",
		parameters: z.object({}),
		execute: async () => {
			const success = city.closeValve();

			return { success };
		},
	});
}
