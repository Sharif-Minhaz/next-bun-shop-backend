import { z } from "zod";

const addProductSchema = z.object({
	name: z
		.string({ required_error: "Product name is required" })
		.min(1, "Product name is required"),
	description: z
		.string({ required_error: "Product description is required" })
		.min(1, "Product name is required"),
	image: z
		.string({ required_error: "Product image is required" })
		.min(1, "Product name is required"),
	category: z
		.number({ required_error: "Product category id is required" })
		.min(1, "Product brand is required"),
	price: z
		.number({ required_error: "Price is required" })
		.min(1, "Price value shouldn't be minimum than 1tk."),
	stock: z
		.number({ required_error: "Product stock information is required" })
		.min(1, "Product stock value shouldn't be minimum than 1."),
});

export { addProductSchema };
