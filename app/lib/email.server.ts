import "server-only";

import { Resend } from "resend";
import { SITE } from "../config/site";
import type { OrderPayload } from "./orders.server";

type OrderEmailDetails = {
  trackingId: string;
  total: number;
  customer: Pick<OrderPayload, "name" | "email" | "phone" | "address" | "city">;
  items: OrderPayload["items"];
};

function formatKes(amount: number): string {
  return new Intl.NumberFormat(SITE.currency.locale, {
    style: "currency",
    currency: SITE.currency.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildOrderHtml(order: OrderEmailDetails): string {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<li>${item.name} × ${item.qty} — ${formatKes(item.price * item.qty)}</li>`
    )
    .join("");

  return `
    <h2>New order ${order.trackingId}</h2>
    <p><strong>${order.customer.name}</strong></p>
    <p>${order.customer.email} · ${order.customer.phone}</p>
    <p>${order.customer.address}, ${order.customer.city}</p>
    <ul>${itemsHtml}</ul>
    <p><strong>Total: ${formatKes(order.total)}</strong></p>
  `;
}

export async function sendOrderEmails(order: OrderEmailDetails): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM ?? "Patril Appliances <onboarding@resend.dev>";
  const notifyEmail = process.env.ORDER_NOTIFY_EMAIL ?? SITE.email;
  const html = buildOrderHtml(order);

  const sends = [
    resend.emails.send({
      from,
      to: notifyEmail,
      subject: `New order ${order.trackingId}`,
      html,
    }),
    resend.emails.send({
      from,
      to: order.customer.email,
      subject: `Your Patril order ${order.trackingId}`,
      html: `
        <h2>Thanks for your order, ${order.customer.name}!</h2>
        <p>Reference: <strong>${order.trackingId}</strong></p>
        <p>We'll contact you at ${order.customer.phone} to confirm delivery and payment.</p>
        ${html}
      `,
    }),
  ];

  await Promise.allSettled(sends);
}
