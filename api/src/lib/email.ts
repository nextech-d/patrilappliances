import { Resend } from "resend";
import { SITE, absoluteUrl } from "./site.js";
import type { OrderPayload } from "./orders.js";

type OrderEmailDetails = {
  trackingId: string;
  total: number;
  customer: Pick<OrderPayload, "name" | "email" | "phone" | "address" | "city">;
  items: OrderPayload["items"];
};

type StatusEmailDetails = {
  trackingId: string;
  status: string;
  customerName: string;
  customerEmail: string;
};

function formatKes(amount: number): string {
  return new Intl.NumberFormat(SITE.currency.locale, {
    style: "currency",
    currency: SITE.currency.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

function emailShell(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#171717;max-width:560px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;">${title}</h1>
  ${body}
</body>
</html>`;
}

function buildItemsHtml(items: OrderPayload["items"]): string {
  return items
    .map(
      (item) =>
        `<li>${item.name} × ${item.qty} — ${formatKes(item.price * item.qty)}</li>`
    )
    .join("");
}

function buildCustomerConfirmationHtml(order: OrderEmailDetails): string {
  const trackUrl = absoluteUrl(`/track-order?id=${encodeURIComponent(order.trackingId)}`);
  return emailShell(
    `Thanks for your order, ${order.customer.name}!`,
    `<p>Reference: <strong>${order.trackingId}</strong></p>
     <ul>${buildItemsHtml(order.items)}</ul>
     <p><strong>Total: ${formatKes(order.total)}</strong></p>
     <p><a href="${trackUrl}">Track your order</a></p>`
  );
}

function buildOrderHtml(order: OrderEmailDetails): string {
  return emailShell(
    `New order ${order.trackingId}`,
    `<p>${order.customer.name} — ${order.customer.phone}</p>
     <ul>${buildItemsHtml(order.items)}</ul>
     <p><strong>Total: ${formatKes(order.total)}</strong></p>`
  );
}

function buildStatusUpdateHtml(order: StatusEmailDetails): string {
  const trackUrl = absoluteUrl(`/track-order?id=${encodeURIComponent(order.trackingId)}`);
  return emailShell(
    `Order update: ${order.trackingId}`,
    `<p>Hi ${order.customerName}, status: <strong>${order.status}</strong></p>
     <p><a href="${trackUrl}">View order</a></p>`
  );
}

export async function sendOrderEmails(order: OrderEmailDetails): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM ?? "HomeVibe <onboarding@resend.dev>";
  const notifyEmail = process.env.ORDER_NOTIFY_EMAIL ?? SITE.email;

  await Promise.allSettled([
    resend.emails.send({
      from,
      to: notifyEmail,
      subject: `New order ${order.trackingId}`,
      html: buildOrderHtml(order),
    }),
    resend.emails.send({
      from,
      to: order.customer.email,
      subject: `Your HomeVibe order ${order.trackingId}`,
      html: buildCustomerConfirmationHtml(order),
    }),
  ]);
}

export async function sendOrderStatusEmail(order: StatusEmailDetails): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM ?? "HomeVibe <onboarding@resend.dev>";

  await resend.emails.send({
    from,
    to: order.customerEmail,
    subject: `Order ${order.trackingId} — ${order.status}`,
    html: buildStatusUpdateHtml(order),
  });
}
