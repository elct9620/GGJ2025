import { z } from "zod";
import { tool } from "ai";

import { City } from "@entity/City";

export function canEnableProtectMachine(city: City) {
	return tool({
		description:
			"Can enable the protect machine to reduce damage rate, if the machine is already enabled it will return false",
		parameters: z.object({}),
		execute: async () => {
			const success = city.enableProtectedMachine();

			return { success };
		},
	});
}

export function canCallPeople(city: City) {
	return tool({
		description:
			"Can call people to reduce damage rate, if the people is already called it will return false",
		parameters: z.object({}),
		execute: async () => {
			const success = city.callPeople();

			return { success };
		},
	});
}
