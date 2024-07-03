import { Hono } from "hono";
import {
	getAllProductController,
	addProductController,
	updateProductController,
	deleteProductController,
	getSingleProductController,
} from "../controllers/product.controller";
import { addProductSchema } from "../validators/product";
import { zValidator } from "@hono/zod-validator";
import { isAdmin, isLoggedIn } from "../middlewares/auth.middleware";

const productRouter = new Hono();

productRouter.get("/", getAllProductController);
productRouter.get("/:productId", getSingleProductController);

productRouter.post("/add", isLoggedIn, zValidator("json", addProductSchema), addProductController);

productRouter.patch(
	"/update/:productId",
	isLoggedIn,
	isAdmin,
	zValidator("json", addProductSchema),
	updateProductController
);

productRouter.delete("/:productId", isLoggedIn, isAdmin, deleteProductController);

export default productRouter;
