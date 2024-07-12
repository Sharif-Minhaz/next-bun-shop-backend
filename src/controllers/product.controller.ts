import { NeonQueryFunction } from "@neondatabase/serverless";
import { connect } from "../db";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

const sql: NeonQueryFunction<false, false> = await connect();

async function getAllProductController(ctx: Context) {
	const { page = 1, categories } = ctx.req.query();

	const ITEMS_PER_PAGE = 8;
	const offset = (Number(page) - 1) * ITEMS_PER_PAGE;

	try {
		const cat_data = categories?.split(",").map((data) => Number(data));

		const [rows, countResult] = await Promise.all([
			sql`
				SELECT * FROM products
				WHERE category_id::integer = ANY(${cat_data})
				LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
			`,
			sql`
				SELECT COUNT(*) FROM products WHERE category_id::integer = ANY(${cat_data})
			`,
		]);

		return ctx.json({
			data: rows,
			count: countResult[0].count,
			message: "Product information",
		});
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
		const { name, price, stock, category, description, image } = await ctx.req.json();

		const id = crypto.randomUUID();

		const checkProductExists = await sql`SELECT id FROM products WHERE name = ${name}`;
		if (checkProductExists.length > 0) {
			return ctx.json({ message: "Product already exists, Try adding new one" }, 409);
		}

		const rows =
			await sql`INSERT INTO products (id, name, price, stock, category_id, description, image) VALUES (${id}, ${name}, ${Number(
				price
			)}, ${Number(stock)}, ${category}, ${description}, ${image}) RETURNING *`;

		return ctx.json(
			{
				success: true,
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
		const { name, price, stock, category, description, image } = await ctx.req.json();
		const id = ctx.req.param("productId");

		const checkProductExists = await sql`SELECT id FROM products WHERE id = ${id}`;
		if (!checkProductExists.length) {
			return ctx.json({ message: "Product doesn't exist" }, 404);
		}

		const rows =
			await sql`UPDATE products SET name=${name}, price=${price}, stock=${stock}, category_id=${category}, description=${description}, image=${image} WHERE id=${id} RETURNING *`;

		return ctx.json(
			{
				success: true,
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
				success: true,
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
