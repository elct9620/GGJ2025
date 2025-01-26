import { Hono } from "hono";
import { cache } from "hono/cache";
import { compress } from "hono/compress";
import { etag } from "hono/etag";

import { getContainer } from "./container";
import { CityViewController } from "@controller/CityViewController";
import { Credit } from "@view/Credit";

const app = new Hono<{ Bindings: Env }>();
app.use(etag());
app.use(
	cache({
		cacheName: "atlan",
		cacheControl: "public, max-age=3600",
	}),
);

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

app.get("/credit", (c) => {
	return c.html(<Credit />);
});

export default app;
