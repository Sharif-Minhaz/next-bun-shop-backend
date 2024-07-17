import { Hono } from "hono";

import { zValidator } from "@hono/zod-validator";
import { isAdmin, isLoggedIn } from "../middlewares/auth.middleware";
import {
	acceptOrderController,
	addOrderController,
	cancelOrderController,
	deleteOrderController,
	getAllOrderController,
	getUserAllOrderController,
} from "../controllers/order.controller";
import { addOrderSchema } from "../validators/order";

const orderRoute = new Hono();

orderRoute.get("/", isLoggedIn, isAdmin, getAllOrderController);
orderRoute.post(
	"/add/:productId",
	isLoggedIn,
	zValidator("json", addOrderSchema),
	addOrderController
);

orderRoute.patch("/cancel/:orderId/:productId", isLoggedIn, isAdmin, cancelOrderController);
orderRoute.patch("/accept/:orderId", isLoggedIn, isAdmin, acceptOrderController);

orderRoute.get("/", isLoggedIn, getAllOrderController);
orderRoute.get("/user", isLoggedIn, getUserAllOrderController);

orderRoute.delete("/:orderId", isLoggedIn, isAdmin, deleteOrderController);

export default orderRoute;
