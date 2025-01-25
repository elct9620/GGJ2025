import { z } from "zod";
import { tool } from "ai";

import { City } from "@entity/City";
import { NpcName } from "@entity/Npc";

export function canGetFavorability(npc: NpcName, city: City) {
	return tool({
		description: "Get the favorability of the NPC",
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
			"According to the interaction with the NPC change the favorability",
		parameters: z.object({
			change: z.number().int().min(-10).max(10),
		}),
		execute: async ({ change }) => {
			const prevFavorability = city.findNpc(npc)?.favorability;
			city.changeFavorability(npc, change);
			const newFavorability = city.findNpc(npc)?.favorability;

			return { change, prevFavorability, newFavorability };
		},
	});
}
