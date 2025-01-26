import { tool } from "ai";
import { z } from "zod";

import { City } from "@entity/City";
import { NpcName } from "@entity/Npc";

export function canGetFavorability(npc: NpcName, city: City) {
	return tool({
		description: "Get the favorability of the NPC himself",
		parameters: z.object({}),
		execute: async () => {
			const favorability = city.findNpc(npc)?.favorability ?? 50;

			return { favorability };
		},
	});
}

export function canChangeFavorability(npc: NpcName, city: City) {
	return tool({
		description:
			"According to the player message, the NPC alway change the favorability each time",
		parameters: z.object({
			change: z.number().int().min(-10).max(20),
		}),
		execute: async ({ change }) => {
			const prevFavorability = city.findNpc(npc)?.favorability;
			city.changeFavorability(npc, change);
			const newFavorability = city.findNpc(npc)?.favorability;

			return { change, prevFavorability, newFavorability };
		},
	});
}
