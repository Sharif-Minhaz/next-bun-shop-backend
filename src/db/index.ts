import { NeonQueryFunction, neon } from "@neondatabase/serverless";

let sql: string | NeonQueryFunction<false, false> = "";

async function connect() {
	// Bun automatically loads the DATABASE_URL from.env.local
	if (!sql) {
		sql = neon(process.env.POSTGRESQL_DATABASE_URL as string) as NeonQueryFunction<
			false,
			false
		>;
	}

	const rows = await (sql as NeonQueryFunction<false, false>)`SELECT version()`;
	console.log(rows[0].version, "-> Database connected successfully!");
	return sql;
}

export { connect };
