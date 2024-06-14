import { NeonQueryFunction } from "@neondatabase/serverless";
import { connect } from "../db";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

const sql: NeonQueryFunction<false, false> = await connect();

async function getAllProductController(ctx: Context) {
	try {
		const rows = await sql`SELECT * FROM products`;

		return ctx.json({ data: rows, message: "Product information" });
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function getSingleProductController(ctx: Context) {
	try {
		const id = ctx.req.param("productId");

		const checkProductExists = await sql`SELECT * FROM products WHERE id = ${id}`;
		if (!checkProductExists.length) {
			return ctx.json({ message: "Product doesn't exist" }, 404);
		}

		return ctx.json({
			data: checkProductExists[0],
			message: `${checkProductExists[0].name} - product details`,
		});
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function addProductController(ctx: Context) {
	try {
		const { name, price, stock, brand } = await ctx.req.json();

		const id = crypto.randomUUID();

		const checkProductExists = await sql`SELECT id FROM products WHERE name = ${name}`;
		if (checkProductExists.length > 0) {
			return ctx.json({ message: "Product already exists, Try adding new one" }, 400);
		}

		const rows =
			await sql`INSERT INTO products (id, name, price, stock, brand) VALUES (${id}, ${name}, ${price}, ${stock}, ${brand}) RETURNING *`;

		return ctx.json(
			{
				data: rows[0],
				message: "Product added successful!",
			},
			201
		);
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function updateProductController(ctx: Context) {
	try {
		const { name, price, stock, brand } = await ctx.req.json();
		const id = ctx.req.param("productId");

		const checkProductExists = await sql`SELECT id FROM products WHERE id = ${id}`;
		if (!checkProductExists.length) {
			return ctx.json({ message: "Product doesn't exist" }, 404);
		}

		const rows =
			await sql`UPDATE products SET name=${name}, price=${price}, stock=${stock}, brand=${brand} WHERE id=${id} RETURNING *`;

		return ctx.json(
			{
				data: rows[0],
				message: "Product updated successfully!",
			},
			200
		);
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function deleteProductController(ctx: Context) {
	try {
		const id = ctx.req.param("productId");

		const checkProductExists = await sql`SELECT id FROM products WHERE id = ${id}`;
		if (!checkProductExists.length) {
			return ctx.json({ message: "Product doesn't exist" }, 404);
		}

		const rows = await sql`DELETE FROM products WHERE id=${id} RETURNING *`;

		return ctx.json(
			{
				data: rows[0],
				message: "Product deleted successfully!",
			},
			200
		);
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

export {
	getAllProductController,
	addProductController,
	updateProductController,
	deleteProductController,
	getSingleProductController,
};
