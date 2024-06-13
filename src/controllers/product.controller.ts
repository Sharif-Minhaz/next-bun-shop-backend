import { Context } from "hono";

async function getAllProduct(ctx: Context) {
	return ctx.text("All product");
}

export { getAllProduct };
