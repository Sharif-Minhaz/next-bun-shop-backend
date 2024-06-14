import { Hono } from "hono";
import { logger } from "hono/logger";
import figlet from "figlet";
import authRouter from "./routers/auth.route";
import productRouter from "./routers/product.route";
import orderRoute from "./routers/order.route";
import { cors } from "hono/cors";

const app = new Hono();

app.use(logger());
app.use(cors());

app.get("/", (c) => {
	const text = figlet.textSync("Server is running!");
	return c.text(text);
});

const apiRouter = new Hono();

apiRouter.route("/auth", authRouter);
apiRouter.route("/product", productRouter);
apiRouter.route("/order", orderRoute);

// Mount the base router to /api/v1
app.route("/api/v1", apiRouter);

export default {
	port: 5000,
	fetch: app.fetch,
};
