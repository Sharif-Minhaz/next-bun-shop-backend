import { NeonQueryFunction } from "@neondatabase/serverless";
import { connect } from "../db";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

const sql: NeonQueryFunction<false, false> = await connect();

async function successPaymentController(ctx: Context) {
	try {
		const tranxId = ctx.req.query("tran_id");
		// insert order information
		const rows1 =
			await sql`UPDATE orders SET status='accepted' WHERE transaction_id = ${tranxId} RETURNING *`;

		// update product stock
		await sql`UPDATE products SET stock = stock - ${rows1[0]?.count} WHERE id = ${rows1[0]?.productId} RETURNING *`;

		return ctx.redirect(`${Bun.env.CLIENT_ROOT}/`);
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function cancelPaymentController(ctx: Context) {
	try {
		return ctx.redirect(`${Bun.env.CLIENT_ROOT}/`);
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function failPaymentController(ctx: Context) {
	try {
		const tranxId = ctx.req.query("tran_id");
		// insert order information
		await sql`UPDATE orders SET status='cancelled' WHERE transaction_id = ${tranxId} RETURNING *`;

		return ctx.redirect(`${Bun.env.CLIENT_ROOT}/`);
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function ipnPaymentController(ctx: Context) {
	try {
		const tranxId = ctx.req.query("tran_id");
		// insert order information
		const rows1 =
			await sql`UPDATE orders SET status='accepted' WHERE transaction_id = ${tranxId} RETURNING *`;

		// update product stock
		await sql`UPDATE products SET stock = stock - ${rows1[0]?.count} WHERE id = ${rows1[0]?.productId} RETURNING *`;

		return ctx.redirect(`${Bun.env.CLIENT_ROOT}/`);
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

export {
	successPaymentController,
	failPaymentController,
	ipnPaymentController,
	cancelPaymentController,
};
