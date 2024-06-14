import { verify } from "hono/jwt";
import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";

async function isLoggedIn(ctx: Context, next: Next) {
	const secretKey = Bun.env.JWT_SECRET;
	const tokenToVerify = getCookie(ctx, "auth");

	if (!tokenToVerify) return ctx.json({ message: "Token not found, user not logged in." }, 400);

	const decodedPayload = await verify(tokenToVerify, secretKey as string);

	// Attach userData to the context object
	ctx.set("user", decodedPayload);

	await next();
}

async function isNotLoggedIn(ctx: Context, next: Next) {
	const token = getCookie(ctx, "auth");

	if (token) {
		return ctx.json({ message: "User already logged in" }, 400);
	}

	await next();
}

async function isAdmin(ctx: Context, next: Next) {
	const secretKey = Bun.env.JWT_SECRET;
	const tokenToVerify = getCookie(ctx, "auth");

	if (!tokenToVerify) return ctx.json({ message: "Token not found, user not logged in." }, 400);

	const decodedPayload = await verify(tokenToVerify, secretKey as string);

	if (decodedPayload.role === "admin") {
		return await next();
	}

	return ctx.json({ message: "User is not an admin" }, 400);
}

export { isLoggedIn, isNotLoggedIn, isAdmin };
