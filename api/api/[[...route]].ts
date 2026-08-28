import { handle } from "hono/vercel";
import { createApp } from "../src/app.js";

export const runtime = "nodejs";

const app = createApp("/api");
const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;

export default handler;
