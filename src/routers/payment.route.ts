import { Hono } from "hono";
import { isLoggedIn } from "../middlewares/auth.middleware";
import {
	successPaymentController,
	failPaymentController,
	cancelPaymentController,
	ipnPaymentController,
} from "../controllers/payment.controller";

const paymentRouter = new Hono();

paymentRouter.post("/success", isLoggedIn, successPaymentController);
paymentRouter.post("/fail", isLoggedIn, failPaymentController);
paymentRouter.post("/cancel", isLoggedIn, cancelPaymentController);
paymentRouter.post("/ipn", isLoggedIn, ipnPaymentController);

export default paymentRouter;
