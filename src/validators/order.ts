import { z } from "zod";

const addOrderSchema = z.object({
	count: z
		.number({ required_error: "Count is required" })
		.min(1, "Price value shouldn't be minimum than 1."),
	totalPrice: z
		.number({ required_error: "Total price information is required" })
		.min(1, "Total price information value shouldn't be minimum than 1tk."),
});

export { addOrderSchema };
