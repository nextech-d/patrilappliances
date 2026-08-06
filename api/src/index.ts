import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { config as loadEnv } from "dotenv";
import { verifyAdminToken } from "./lib/admin-jwt.js";
import { extractBearerToken } from "./lib/session.js";
import { handleGetProducts } from "./routes/products.js";
import { ordersRoute, adminOrdersRoute } from "./routes/orders.js";
import { adminProductsRoute } from "./routes/admin/products.js";
import { adminCatalogRoute } from "./routes/admin/catalog.js";
import { adminDashboardRoute } from "./routes/admin/dashboard.js";
import { adminUploadsRoute } from "./routes/admin/uploads.js";
import { authRoute, accountRoute } from "./routes/auth.js";

loadEnv({ path: ".env.local" });
loadEnv({ path: "../.env.local" });
loadEnv();

const app = new Hono();

const origins = (process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  "*",
  cors({
    origin: origins,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.get("/health", (c) => c.json({ ok: true, service: "patril-api" }));

app.get("/products", async (c) => {
  try {
    const data = await handleGetProducts();
    return c.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load products.";
    return c.json({ success: false, message }, 503);
  }
});

app.route("/orders", ordersRoute);
app.route("/auth", authRoute);
app.route("/account", accountRoute);

const adminAuth = async (c: import("hono").Context, next: () => Promise<void>) => {
  const token = extractBearerToken(c.req.header("Authorization"));
  const valid = await verifyAdminToken(token ?? undefined);
  if (!valid) {
    return c.json({ success: false, message: "Unauthorized." }, 401);
  }
  await next();
};

app.use("/admin/*", adminAuth);
app.route("/admin/orders", adminOrdersRoute);
app.route("/admin/products", adminProductsRoute);
app.route("/admin/catalog", adminCatalogRoute);
app.route("/admin/dashboard", adminDashboardRoute);
app.route("/admin/uploads", adminUploadsRoute);

const port = Number(process.env.PORT ?? 4000);

console.log(`Patril API listening on http://localhost:${port}`);

serve({ fetch: app.fetch, port });

export default app;
