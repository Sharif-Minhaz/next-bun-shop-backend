import { Hono } from "hono";

import { zValidator } from "@hono/zod-validator";
import { isAdmin, isLoggedIn } from "../middlewares/auth.middleware";
import {
	acceptOrderController,
	addOrderController,
	cancelOrderController,
	deleteOrderController,
	getAllOrderController,
} from "../controllers/order.controller";

const orderRoute = new Hono();

orderRoute.get("/", isLoggedIn, isAdmin, getAllOrderController);
orderRoute.post("/add", isLoggedIn, addOrderController);

orderRoute.patch("/cancel/:orderId", isLoggedIn, isAdmin, cancelOrderController);
orderRoute.patch("/accept/:orderId", isLoggedIn, isAdmin, acceptOrderController);

orderRoute.get("/:userId", isLoggedIn, getAllOrderController); // get joint product table with user information

orderRoute.delete("/:orderId", isLoggedIn, isAdmin, deleteOrderController);

export default orderRoute;
