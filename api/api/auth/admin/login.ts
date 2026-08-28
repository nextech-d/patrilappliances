import { signAdminToken, verifyAdminPassword } from "../../../src/lib/admin-jwt.js";

export const runtime = "nodejs";

function corsHeaders(req: Request): Headers {
  const origin = req.headers.get("origin") ?? "";
  const allowed =
    origin === "https://admin.homevibe.co.ke" ||
    origin === "https://homevibe.co.ke" ||
    origin === "http://localhost:5173" ||
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);
  const headers = new Headers();
  if (allowed) headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Vary", "Origin");
  return headers;
}

export function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

export async function POST(req: Request) {
  const headers = corsHeaders(req);
  headers.set("Content-Type", "application/json");

  let password = "";
  try {
    const body = (await req.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return Response.json({ success: false, message: "Invalid JSON." }, { status: 400, headers });
  }

  if (!verifyAdminPassword(password)) {
    return Response.json({ success: false, message: "Incorrect password." }, { status: 401, headers });
  }

  const token = await signAdminToken();
  if (!token) {
    return Response.json(
      { success: false, message: "Admin auth is not configured." },
      { status: 503, headers }
    );
  }

  return Response.json({ success: true, token }, { headers });
}
