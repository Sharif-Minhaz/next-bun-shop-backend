import { Hono } from "hono";
import { getAllProduct } from "../controllers/product.controller";

const productRouter = new Hono();

productRouter.get("/", getAllProduct);

export default productRouter;
