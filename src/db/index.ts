import { NeonQueryFunction, neon } from "@neondatabase/serverless";
import { HTTPException } from "hono/http-exception";

let sql: NeonQueryFunction<false, false>;

async function connect() {
	try {
		// Bun automatically loads the DATABASE_URL from.env.local
		if (!sql) {
			sql = neon(process.env.POSTGRESQL_DATABASE_URL as string) as NeonQueryFunction<
				false,
				false
			>;
		}

		const rows = await (sql as NeonQueryFunction<false, false>)`SELECT version()`;
		console.info(rows[0].version, "-> Database connected successfully!");
		return sql;
	} catch (error) {
		console.error(error);
		throw new HTTPException(500, { message: "Server error occurred", cause: error });
	}
}

export { connect };
