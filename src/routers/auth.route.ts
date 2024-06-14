import { Hono } from "hono";
import {
	loginController,
	registrationController,
	viewAllUsersController,
	logoutController,
} from "../controllers/auth.controller";
import { loginSchema, regSchema } from "../validators/auth";
import { zValidator } from "@hono/zod-validator";
import { isAdmin, isLoggedIn, isNotLoggedIn } from "../middlewares/auth.middleware";

const authRouter = new Hono();

authRouter.get("/", isAdmin, viewAllUsersController);
authRouter.post("/login", isNotLoggedIn, zValidator("json", loginSchema), loginController);
authRouter.post(
	"/registration",
	isNotLoggedIn,
	zValidator("json", regSchema),
	registrationController
);

authRouter.post("/logout", isLoggedIn, logoutController);

export default authRouter;
