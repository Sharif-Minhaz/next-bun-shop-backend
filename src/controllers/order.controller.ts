import { connect } from "../db";
import { Context } from "hono";

const sql = await connect();

async function getAllOrderController(ctx: Context) {
	const rows = await (sql as Function)`SELECT * FROM orders`;

	return ctx.json({ data: rows, message: "Order information" });
}

async function addOrderController(ctx: Context) {}

async function cancelOrderController(ctx: Context) {}

async function acceptOrderController(ctx: Context) {}

async function deleteOrderController(ctx: Context) {}

async function getUserAllOrderController(ctx: Context) {}

export {
	getAllOrderController,
	addOrderController,
	cancelOrderController,
	acceptOrderController,
	deleteOrderController,
	getUserAllOrderController,
};
