import { Context } from "hono";
import SSLCommerzPayment from "sslcommerz-lts";

async function init_ssl_controller(ctx: Context) {
	const { price } = await ctx.req.json();

	const data = {
		total_amount: price || 2000,
		currency: "BDT",
		tran_id: crypto.randomUUID(),
		success_url: `${Bun.env.CLIENT_ROOT}/success`,
		fail_url: `${Bun.env.CLIENT_ROOT}/fail`,
		cancel_url: `${Bun.env.CLIENT_ROOT}/cancel`,
		ipn_url: `${Bun.env.CLIENT_ROOT}/ipn`,
		shipping_method: "Courier",
		product_name: "Computer.",
		product_category: "Electronic",
		product_profile: "general",
		cus_name: "Customer Name",
		cus_email: "customer@example.com",
		cus_add1: "Dhaka",
		cus_add2: "Dhaka",
		cus_city: "Dhaka",
		cus_state: "Dhaka",
		cus_postcode: "1000",
		cus_country: "Bangladesh",
		cus_phone: "01711111111",
		cus_fax: "01711111111",
		ship_name: "Customer Name",
		ship_add1: "Dhaka",
		ship_add2: "Dhaka",
		ship_city: "Dhaka",
		ship_state: "Dhaka",
		ship_postcode: 1000,
		ship_country: "Bangladesh",
	};
	const sslcommerz = new SSLCommerzPayment(
		Bun.env.SSLCOMMERZ_STORE_ID,
		Bun.env.SSLCOMMERZ_STORE_PASSWORD,
		false
	);

	console.log(sslcommerz);

	try {
		const apiResponse = await sslcommerz.init(data);
		console.log(apiResponse);
		const GatewayPageURL = apiResponse.GatewayPageURL;
		console.log(GatewayPageURL);
		ctx.redirect(GatewayPageURL || "/", 301);
	} catch (err) {
		console.error(err);
		ctx.json({ success: false, message: "Something went wrong", err }, 500);
	}
}

export { init_ssl_controller };
