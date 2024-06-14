import { z } from "zod";

const addOrderSchema = z.object({
	count: z
		.number({ required_error: "Count is required" })
		.min(1, "Price value shouldn't be minimum than 1."),
});

export { addOrderSchema };
