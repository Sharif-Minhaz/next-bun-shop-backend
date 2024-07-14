import { Context } from "hono";
import SSLCommerzPayment from "sslcommerz-lts";

async function init_sslCommerzController(ctx: Context) {
	const data = {
		total_amount: 100,
		currency: "BDT",
		tran_id: "REF123", // use unique tran_id for each api call
		success_url: "http://localhost:3030/success",
		fail_url: "http://localhost:3030/fail",
		cancel_url: "http://localhost:3030/cancel",
		ipn_url: "http://localhost:3030/ipn",
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
	const sslcz = new SSLCommerzPayment(
		Bun.env.SSLCOMMERZ_STORE_ID,
		Bun.env.SSLCOMMERZ_STORE_PASSWORD,
		Bun.env.IS_LIVE || false
	);

	sslcz
		.init(data)
		.then((apiResponse: any) => {
			// Redirect the user to payment gateway
			let GatewayPageURL = apiResponse.GatewayPageURL;

			return ctx.redirect(GatewayPageURL);
		})
		.catch((err: any) => {
			return ctx.json({ success: false, err });
		});

	return ctx.json(
		{
			success: false,
			message: "sslcommerz is not working!",
		},
		500
	);
}

export { init_sslCommerzController };
