import { handle } from "hono/vercel";
import { createApp } from "../src/app.js";

export const config = {
  runtime: "nodejs",
};

const app = createApp("/api");

export default handle(app);
