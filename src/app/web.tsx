import { Hono } from "hono";
import { getContainer } from "./container";

const app = new Hono<{ Bindings: Env }>();

app.get("/city/:id", async (c) => {
	const id = c.req.param("id");

	return c.html(<div>CityId - {id}</div>);
});

export default app;
