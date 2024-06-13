import { Context } from "hono";
import { connect } from "../db";
const sql = connect();

async function loginController(ctx: Context) {
	return ctx.text("login");
}

async function registrationController(ctx: Context) {
	return ctx.text("registration");
}

async function viewAllUsers(ctx: Context) {
	return ctx.text("All users");
}

export { loginController, registrationController, viewAllUsers };
