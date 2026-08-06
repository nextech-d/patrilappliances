import { Hono } from "hono";
import { listCategoriesForStorefront } from "../lib/catalog.js";

export const catalogRoute = new Hono();

catalogRoute.get("/categories", async (c) => {
  const categories = await listCategoriesForStorefront();
  return c.json({ success: true, categories });
});
