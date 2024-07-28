import { NeonQueryFunction } from "@neondatabase/serverless";
import { connect } from "../db";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

const sql: NeonQueryFunction<false, false> = await connect();

async function getAllOrderController(ctx: Context) {
	try {
		const rows = await sql`SELECT 
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
				products.image,
				products.stock, 
				products.category_id,
				categories.category_name
			FROM orders 
			INNER JOIN users ON orders.userid = users.id 
			INNER JOIN products ON orders.productid = products.id 
			INNER JOIN categories ON orders.category_id = categories.id 
		`;

		return ctx.json({ data: rows, message: "Order information" });
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function addOrderController(ctx: Context) {
	try {
		const user = ctx.get("user");
		const productId = ctx.req.param("productId");
		const { count } = await ctx.req.json();

		const checkProduct = await sql`SELECT * FROM products WHERE id = ${productId}`;
		if (!checkProduct.length) {
			return ctx.json({ message: "Product doesn't exist" }, 404);
		}

		// getting the final order price
		const totalPrice = count * checkProduct[0]?.price;
		const userId = user.id;
		const orderId = crypto.randomUUID();
		const category_id = checkProduct[0].category_id;
		const tranxId = crypto.randomUUID();

		// call ssl outer api for purchasing

		const res = await fetch("http://localhost:8080/ssl-request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				price: totalPrice,
				name: checkProduct[0]?.name,
				customer_name: user.name,
				customer_email: user.email,
				tran_id: tranxId,
			}),
		});

		const gatewayUrl = await res.json();

		// insert order information
		const rows1 = sql`INSERT INTO orders (id, userid, productid, count, totalprice, category_id, transaction_id) VALUES (${orderId}, ${userId}, ${productId}, ${count}, ${totalPrice}, ${category_id}, ${tranxId}) RETURNING *`;

		// update product stock
		const rows2 = sql`UPDATE products SET stock = stock - ${count} WHERE id = ${productId} RETURNING *`;

		await Promise.all([rows1, rows2]);

		console.log("Bun.js - Hono", gatewayUrl);

		return ctx.json({ url: gatewayUrl.url, message: "Payment redirect url" }, 201);
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function cancelOrderController(ctx: Context) {
	try {
		const orderId = ctx.req.param("orderId");
		const productId = ctx.req.param("productId");

		const checkOrder = await sql`SELECT * FROM orders WHERE id = ${orderId}`;
		if (!checkOrder.length) {
			return ctx.json({ message: "Order doesn't exist" }, 404);
		}

		const rows =
			await sql`UPDATE orders SET status='cancelled' WHERE id = ${orderId} RETURNING *`;

		if (rows.length) {
			await sql`UPDATE products SET stock = stock + ${checkOrder[0].count} WHERE id = ${productId}`;
		}

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
		const userId = ctx.get("user").id;

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
				products.image,
				products.category_id,
				categories.category_name
			FROM orders 
			INNER JOIN users ON orders.userid = users.id 
			INNER JOIN products ON orders.productid = products.id 
			INNER JOIN categories ON orders.category_id = categories.id 
			WHERE orders.userid = ${userId}`;

		return ctx.json({ success: true, data: rows, message: "Order information" });
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
