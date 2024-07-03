import { NeonQueryFunction } from "@neondatabase/serverless";
import { connect } from "../db";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

const sql: NeonQueryFunction<false, false> = await connect();

async function getAllCategoriesController(ctx: Context) {
	try {
		const rows = await sql`SELECT * FROM categories`;

		return ctx.json({ data: rows, message: "Categories information" });
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function addCategoryController(ctx: Context) {
	try {
		const { category_name } = await ctx.req.json();

		const checkName =
			await sql`SELECT * FROM categories WHERE LOWER(category_name) = LOWER(${category_name})`;
		if (checkName.length) {
			return ctx.json({ success: false, message: "Category already exist" }, 400);
		}

		const rows =
			await sql`INSERT INTO categories (category_name) VALUES (${category_name}) RETURNING *`;

		return ctx.json({ success: true, data: rows[0], message: "Category information" }, 201);
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

export { getAllCategoriesController, addCategoryController };
