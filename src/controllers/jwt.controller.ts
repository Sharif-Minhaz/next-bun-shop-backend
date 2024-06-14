import { sign } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import { Context } from "hono";
import { setCookie } from "hono/cookie";

async function signJWT(payload: JWTPayload, ctx: Context) {
	const token = await sign(
		{ ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 6 }, // 6 hours
		Bun.env.JWT_SECRET as string
	);

	if (!token) return ctx.json({ message: "Token not generated" }, 400);

	setCookie(ctx, "auth", token, {
		path: "/",
		secure: true,
		domain: "localhost",
		httpOnly: true,
		maxAge: 1000 * 6 * 60 * 60, // 6 hours
		sameSite: "Strict",
	});

	return token;
}

export { signJWT };
