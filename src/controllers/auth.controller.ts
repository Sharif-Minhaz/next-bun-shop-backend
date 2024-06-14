import { Context } from "hono";
import { connect } from "../db";
import { signJWT } from "./jwt.controller";
import { deleteCookie } from "hono/cookie";

const sql = await connect();

async function loginController(ctx: Context) {
	const { email, password } = await ctx.req.json();

	const userInfo = await (sql as Function)`SELECT * FROM users WHERE email = ${email}`;

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
}

async function registrationController(ctx: Context) {
	const { name, email, role, password } = await ctx.req.json();

	const checkEmailQuery = await (sql as Function)`SELECT id FROM users WHERE email = ${email}`;
	if (checkEmailQuery.length > 0) {
		return ctx.json({ message: "Email already exists, Try new one" }, 400);
	}

	const id = crypto.randomUUID();

	const hashedPassword = await Bun.password.hash(password, {
		algorithm: "bcrypt",
		cost: 4, // number between 4-31
	});

	const rows =
		await (sql as Function)`INSERT INTO users (id, name, password, role, email) VALUES (${id}, ${name}, ${hashedPassword}, ${role}, ${email}) RETURNING *`;

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
}

async function viewAllUsersController(ctx: Context) {
	const rows = await (sql as Function)`SELECT id, name, email, role FROM users`;

	return ctx.json({ data: rows, message: "User information" });
}

async function logoutController(ctx: Context) {
	deleteCookie(ctx, "auth", {
		path: "/",
		secure: true,
		domain: "localhost",
	});

	return ctx.json({ message: "Logout successful" }, 200);
}

export { loginController, registrationController, viewAllUsersController, logoutController };
