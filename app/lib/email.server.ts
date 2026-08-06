import "server-only";

import { Resend } from "resend";
import { SITE } from "../config/site";
import { absoluteUrl } from "./seo";
import type { OrderPayload } from "./orders.server";

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
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.5;color:#171717;max-width:560px;margin:0 auto;padding:24px;">
  <p style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#737373;margin:0 0 8px;">
    ${SITE.name}
  </p>
  <h1 style="font-size:20px;margin:0 0 16px;">${title}</h1>
  ${body}
  <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />
  <p style="font-size:12px;color:#737373;margin:0;">
    Questions? Reply to this email or WhatsApp ${SITE.phone}.
  </p>
</body>
</html>`;
}

function buildItemsHtml(items: OrderPayload["items"]): string {
  const rows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f5f5f5;">${item.name} × ${item.qty}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f5f5f5;text-align:right;font-weight:600;">
            ${formatKes(item.price * item.qty)}
          </td>
        </tr>`
    )
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0;">
      ${rows}
    </table>`;
}

function buildOrderHtml(order: OrderEmailDetails): string {
  const trackUrl = absoluteUrl(`/track-order?id=${encodeURIComponent(order.trackingId)}`);

  return emailShell(
    `Order ${order.trackingId}`,
    `
    <p style="margin:0 0 12px;"><strong>${order.customer.name}</strong></p>
    <p style="margin:0 0 12px;font-size:14px;color:#525252;">
      ${order.customer.email} · ${order.customer.phone}<br />
      ${order.customer.address}, ${order.customer.city}
    </p>
    ${buildItemsHtml(order.items)}
    <p style="font-size:16px;font-weight:700;margin:16px 0 0;">Total: ${formatKes(order.total)}</p>
    <p style="margin:20px 0 0;">
      <a href="${trackUrl}" style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
        Track order
      </a>
    </p>`
  );
}

function buildCustomerConfirmationHtml(order: OrderEmailDetails): string {
  const trackUrl = absoluteUrl(`/track-order?id=${encodeURIComponent(order.trackingId)}`);

  return emailShell(
    `Thanks for your order, ${order.customer.name}!`,
    `
    <p style="margin:0 0 12px;font-size:14px;">
      Your reference is <strong style="font-family:monospace;">${order.trackingId}</strong>.
      We'll contact you at <strong>${order.customer.phone}</strong> to confirm delivery and payment.
    </p>
    ${buildItemsHtml(order.items)}
    <p style="font-size:16px;font-weight:700;margin:16px 0 0;">Total: ${formatKes(order.total)}</p>
    <p style="margin:20px 0 0;">
      <a href="${trackUrl}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
        Track your order
      </a>
    </p>`
  );
}

function buildStatusUpdateHtml(order: StatusEmailDetails): string {
  const trackUrl = absoluteUrl(`/track-order?id=${encodeURIComponent(order.trackingId)}`);

  return emailShell(
    `Order update: ${order.trackingId}`,
    `
    <p style="margin:0 0 12px;font-size:14px;">
      Hi ${order.customerName}, your order status is now:
    </p>
    <p style="font-size:18px;font-weight:700;color:#059669;margin:0 0 16px;">${order.status}</p>
    <p style="margin:0 0 12px;font-size:14px;color:#525252;">
      Track anytime with reference <strong style="font-family:monospace;">${order.trackingId}</strong>.
    </p>
    <p style="margin:20px 0 0;">
      <a href="${trackUrl}" style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
        View order status
      </a>
    </p>`
  );
}

async function sendEmails(
  sends: Promise<{ data: unknown; error: unknown }>[]
): Promise<void> {
  await Promise.allSettled(sends);
}

export async function sendOrderEmails(order: OrderEmailDetails): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM ?? "Patril Appliances <onboarding@resend.dev>";
  const notifyEmail = process.env.ORDER_NOTIFY_EMAIL ?? SITE.email;

  await sendEmails([
    resend.emails.send({
      from,
      to: notifyEmail,
      subject: `New order ${order.trackingId}`,
      html: buildOrderHtml(order),
    }),
    resend.emails.send({
      from,
      to: order.customer.email,
      subject: `Your Patril order ${order.trackingId}`,
      html: buildCustomerConfirmationHtml(order),
    }),
  ]);
}

export async function sendOrderStatusEmail(order: StatusEmailDetails): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM ?? "Patril Appliances <onboarding@resend.dev>";

  await sendEmails([
    resend.emails.send({
      from,
      to: order.customerEmail,
      subject: `Order ${order.trackingId} — ${order.status}`,
      html: buildStatusUpdateHtml(order),
    }),
  ]);
}
