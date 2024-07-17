import { Hono } from "hono";
import { init_ssl_controller } from "../controllers/sslCommerz.controller";

const sslCommerz = new Hono();

sslCommerz.post("/", init_ssl_controller);

export default sslCommerz;
