import { Hono } from "hono";
import { init_sslCommerzController } from "../controllers/sslCommerz.controller";

const sslCommerz = new Hono();

sslCommerz.get("/", init_sslCommerzController);

export default sslCommerz;
