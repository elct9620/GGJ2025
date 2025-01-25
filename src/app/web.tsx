import { Hono } from "hono";

import { getContainer } from "./container";
import { CityViewController } from "@controller/CityViewController";

const app = new Hono<{ Bindings: Env }>();

app.get("/city/:id", async (c) => {
	const container = getContainer(c.env);
	const controller = container.resolve(CityViewController);

	const id = c.req.param("id");
	const jsx = await controller.handle(id);

	if (!jsx) {
		return c.text("City not found", 404);
	}

	return c.html(jsx);
});

export default app;
