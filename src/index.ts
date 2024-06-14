import { Hono } from "hono";
import { logger } from "hono/logger";
import figlet from "figlet";
import authRouter from "./routers/auth.route";
import productRouter from "./routers/product.route";
import { cors } from "hono/cors";

const app = new Hono();

app.use(logger());
app.use(cors());

app.get("/", (c) => {
	const text = figlet.textSync("Server is running!");
	return c.text(text);
});

app.route("/auth", authRouter);
app.route("/product", productRouter);

export default {
	port: 5000,
	fetch: app.fetch,
};
