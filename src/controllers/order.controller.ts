import { NeonQueryFunction } from "@neondatabase/serverless";
import { connect } from "../db";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

const sql: NeonQueryFunction<false, false> = await connect();

async function getAllOrderController(ctx: Context) {
	try {
		const rows = await sql`SELECT * FROM orders`;

		return ctx.json({ data: rows, message: "Order information" });
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function addOrderController(ctx: Context) {
	try {
		const productId = ctx.req.param("productId");
		const { count } = await ctx.req.json();

		const checkProduct = await sql`SELECT * FROM products WHERE id = ${productId}`;
		if (!checkProduct.length) {
			return ctx.json({ message: "Product doesn't exist" }, 404);
		}

		// getting the final order price
		const totalPrice = count * checkProduct[0].price;
		const userId = ctx.get("user").id;
		const orderId = crypto.randomUUID();

		const rows =
			await sql`INSERT INTO orders (id, userid, productid, count, totalprice) VALUES (${orderId}, ${userId}, ${productId}, ${count}, ${totalPrice}) RETURNING *`;

		return ctx.json({ data: rows[0], message: "Order information" });
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function cancelOrderController(ctx: Context) {
	try {
		const orderId = ctx.req.param("orderId");

		const checkOrder = await sql`SELECT * FROM orders WHERE id = ${orderId}`;
		if (!checkOrder.length) {
			return ctx.json({ message: "Order doesn't exist" }, 404);
		}

		const rows =
			await sql`UPDATE orders SET status='cancelled' WHERE id = ${orderId} RETURNING *`;

		return ctx.json({ data: rows[0], message: "Order cancelled successfully" });
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function acceptOrderController(ctx: Context) {
	try {
		const orderId = ctx.req.param("orderId");

		const checkOrder = await sql`SELECT * FROM orders WHERE id = ${orderId}`;
		if (!checkOrder.length) {
			return ctx.json({ message: "Order doesn't exist" }, 404);
		}

		const rows =
			await sql`UPDATE orders SET status='accepted' WHERE id = ${orderId} RETURNING *`;

		return ctx.json({ data: rows[0], message: "Order accepted successfully" });
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function deleteOrderController(ctx: Context) {
	try {
		const orderId = ctx.req.param("orderId");

		const checkOrder = await sql`SELECT * FROM orders WHERE id = ${orderId}`;
		if (!checkOrder.length) {
			return ctx.json({ message: "Order doesn't exist" }, 404);
		}

		const rows = await sql`DELETE FROM orders WHERE id=${orderId}`;

		return ctx.json({ data: rows[0], message: "Order deleted successfully" });
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function getUserAllOrderController(ctx: Context) {
	try {
		const userId = ctx.req.param("userId");

		const rows = await sql`
			SELECT 
				orders.id, 
				orders.count, 
				orders.orderat, 
				orders.totalprice, 
				orders.status, 
				orders.userid, 
				users.name AS username, 
				users.email, 
				orders.productid, 
				products.name AS productname, 
				products.price, 
				products.stock, 
				products.brand 
			FROM orders 
			INNER JOIN users ON orders.userid = users.id 
			INNER JOIN products ON orders.productid = products.id 
			WHERE orders.userid = ${userId}`;

		return ctx.json({ data: rows, message: "Order information" });
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

export {
	getAllOrderController,
	addOrderController,
	cancelOrderController,
	acceptOrderController,
	deleteOrderController,
	getUserAllOrderController,
};
