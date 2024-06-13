import { Hono } from "hono";
import {
	loginController,
	registrationController,
	viewAllUsers,
} from "../controllers/auth.controller";

const authRouter = new Hono();

authRouter.get("/", viewAllUsers);
authRouter.post("/login", loginController);
authRouter.post("/registration", registrationController);

export default authRouter;
