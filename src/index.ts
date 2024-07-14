import { Hono } from "hono";
import { logger } from "hono/logger";
import figlet from "figlet";
import authRouter from "./routers/auth.route";
import productRouter from "./routers/product.route";
import orderRouter from "./routers/order.route";
import categoryRouter from "./routers/category.route";
import sslCommerzRouter from "./routers/sslcommerz.route";
import { cors } from "hono/cors";

const app = new Hono();

app.use(logger());
app.use(
	cors({
		origin: ["http://localhost:3001", "https://next-bun-shop-frontend.vercel.app"],
		credentials: true,
	})
);

app.get("/", (c) => {
	const text = figlet.textSync("Server is running!");
	return c.text(text);
});

const apiRouter = new Hono();

apiRouter.route("/auth", authRouter);
apiRouter.route("/sslcommerz", sslCommerzRouter);
apiRouter.route("/category", categoryRouter);
apiRouter.route("/product", productRouter);
apiRouter.route("/order", orderRouter);

// Mount the base router to /api/v1
app.route("/api/v1", apiRouter);

export default {
	port: Bun.env.PORT || 5000,
	fetch: app.fetch,
};
