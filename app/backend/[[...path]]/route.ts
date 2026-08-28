import type { NextRequest } from "next/server";
import { createApp } from "../../../api/dist/app.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const app = createApp("/backend");

async function handler(req: NextRequest) {
  return app.fetch(req);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
