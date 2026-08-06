import { Hono } from "hono";
import { getCustomerForAdmin, listCustomersForAdmin } from "../../lib/customers.js";

export const adminCustomersRoute = new Hono();

adminCustomersRoute.get("/", async (c) => {
  const q = c.req.query("q");
  const customers = await listCustomersForAdmin(q);
  return c.json({ success: true, customers });
});

adminCustomersRoute.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isFinite(id)) {
    return c.json({ success: false, message: "Invalid customer id." }, 400);
  }

  const customer = await getCustomerForAdmin(id);
  if (!customer) return c.json({ success: false, message: "Customer not found." }, 404);
  return c.json({ success: true, customer });
});
