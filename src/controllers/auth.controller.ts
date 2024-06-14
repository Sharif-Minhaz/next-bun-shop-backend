import { Context } from "hono";
import { connect } from "../db";
import { signJWT } from "./jwt.controller";
import { deleteCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { NeonQueryFunction } from "@neondatabase/serverless";

const sql: NeonQueryFunction<false, false> = await connect();

async function loginController(ctx: Context) {
	try {
		const { email, password } = await ctx.req.json();

		const userInfo = await sql`SELECT * FROM users WHERE email = ${email}`;

		if (userInfo[0]?.email !== email) {
			return ctx.json({ message: "Email or password wrong, try again" }, 400);
		}

		const isMatch = await Bun.password.verify(password, userInfo[0]?.password);

		if (isMatch) {
			// sign jwt to the browser end
			await signJWT(
				{
					id: userInfo[0].id,
					email: userInfo[0].email,
					role: userInfo[0].role,
				},
				ctx
			);
			return ctx.json({ message: `Login successful, welcome ${userInfo[0]?.name}` }, 200);
		}

		ctx.json({ message: "Email or password wrong, try again" }, 400);
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function registrationController(ctx: Context) {
	try {
		const { name, email, role, password } = await ctx.req.json();

		const checkEmailQuery = await sql`SELECT id FROM users WHERE email = ${email}`;
		if (checkEmailQuery.length > 0) {
			return ctx.json({ message: "Email already exists, Try new one" }, 400);
		}

		const id = crypto.randomUUID();

		const hashedPassword = await Bun.password.hash(password, {
			algorithm: "bcrypt",
			cost: 4, // number between 4-31
		});

		const rows =
			await sql`INSERT INTO users (id, name, password, role, email) VALUES (${id}, ${name}, ${hashedPassword}, ${role}, ${email}) RETURNING *`;

		// sign jwt to the browser end
		await signJWT(
			{
				id: rows[0].id,
				email: rows[0].email,
				role: rows[0].role,
			},
			ctx
		);

		return ctx.json(
			{
				data: rows[0],
				message: "Registration successful!",
			},
			201
		);
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function viewAllUsersController(ctx: Context) {
	try {
		const rows = await sql`SELECT id, name, email, role FROM users`;

		return ctx.json({ data: rows, message: "User information" });
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function logoutController(ctx: Context) {
	try {
		deleteCookie(ctx, "auth", {
			path: "/",
			secure: true,
			domain: "localhost",
		});

		return ctx.json({ message: "Logout successful" }, 200);
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

export { loginController, registrationController, viewAllUsersController, logoutController };
