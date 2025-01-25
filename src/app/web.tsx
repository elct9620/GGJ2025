import { Hono } from "hono";
import { getContainer } from "./container";

const app = new Hono<{ Bindings: Env }>();

app.get("/city/:id", async (c) => {
	return c.html(<div>Hello World</div>);
});

export default app;
