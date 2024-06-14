import { z } from "zod";

const regSchema = z.object({
	name: z.string({ required_error: "Name is required" }),
	password: z
		.string({ required_error: "Password is required" })
		.min(6, "Password length must be 6 or greater"),
	role: z.string().optional(),
	email: z.string({ required_error: "Email address is required" }).email("Provide a valid email"),
});

const loginSchema = z.object({
	email: z.string({ required_error: "Email address is required" }).email("Provide a valid email"),
	password: z.string({ required_error: "Password is required" }).min(1, "Provide your password"),
});

export { regSchema, loginSchema };
