import { verify } from "hono/jwt";
import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";

async function isLoggedIn(ctx: Context, next: Next) {
	try {
		const secretKey = Bun.env.JWT_SECRET;
		const tokenToVerify = ctx.req.header("authorization")?.split(" ")[1];
		console.log("Authorization token: ", tokenToVerify);

		if (!tokenToVerify || tokenToVerify === "null")
			return ctx.json({ message: "Token not found, user not logged in." }, 401);

		const decodedPayload = await verify(tokenToVerify, secretKey as string);

		// Attach userData to the context object
		ctx.set("user", decodedPayload);

		await next();
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function isNotLoggedIn(ctx: Context, next: Next) {
	try {
		const token = ctx.req.header("authorization")?.split(" ")[1];
		console.log("Authorization token: ", token);

		if (token) {
			return ctx.json({ message: "User already logged in" }, 401);
		}

		await next();
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

async function isAdmin(ctx: Context, next: Next) {
	try {
		const secretKey = Bun.env.JWT_SECRET;
		const tokenToVerify = ctx.req.header("authorization")?.split(" ")[1];
		console.log("Authorization token: ", tokenToVerify);

		if (!tokenToVerify || tokenToVerify === "null")
			return ctx.json({ message: "Token not found, user not logged in." }, 401);

		const decodedPayload = await verify(tokenToVerify, secretKey as string);

		if (decodedPayload.role === "admin") {
			return await next();
		}

		return ctx.json({ message: "User is not an admin" }, 401);
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

export { isLoggedIn, isNotLoggedIn, isAdmin };
