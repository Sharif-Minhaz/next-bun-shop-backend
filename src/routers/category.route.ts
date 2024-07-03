import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { isAdmin, isLoggedIn } from "../middlewares/auth.middleware";
import { addCategorySchema } from "../validators/category";
import {
	addCategoryController,
	getAllCategoriesController,
} from "../controllers/category.controller";

const productRouter = new Hono();

productRouter.get("/", getAllCategoriesController);

productRouter.post(
	"/add",
	isAdmin,
	isLoggedIn,
	zValidator("json", addCategorySchema),
	addCategoryController
);

export default productRouter;
