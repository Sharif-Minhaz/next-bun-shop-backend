import { z } from "zod";

const addCategorySchema = z.object({
	category_name: z
		.string({ required_error: "Name is required" })
		.min(1, "Name length shouldn't be minimum than 1."),
});

export { addCategorySchema };
