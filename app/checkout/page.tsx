"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { CreditCard, CheckCircle, ArrowLeft, ArrowRight, ShieldCheck, PhoneCall, Gift, Smartphone } from "lucide-react";
import { formatPrice } from "../lib/formatPrice";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import DemoModeBanner from "../components/DemoModeBanner";
import { SITE } from "../config/site";

type PaymentMethod = "card" | "mpesa";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart, hydrated } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [completedPaymentMethod, setCompletedPaymentMethod] = useState<PaymentMethod>("card");
  const [deliveryError, setDeliveryError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0 && step !== 3) {
      router.replace("/cart");
    }
  }, [hydrated, items.length, step, router]);

  useEffect(() => {
    if (phone && !mpesaPhone) {
      setMpesaPhone(phone);
    }
  }, [phone, mpesaPhone]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!name || !email || !phone || !address || !city) {
        setDeliveryError("Please fill in all required delivery fields.");
        return;
      }
      setDeliveryError("");
      setStep(2);
    }
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "card") {
      if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
        return;
      }
    } else if (!mpesaPhone) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          city,
          items,
          total,
          paymentMethod,
          cardName: paymentMethod === "card" ? cardName : undefined,
          cardNumber:
            paymentMethod === "card" && cardNumber
              ? "•••• •••• •••• " + cardNumber.slice(-4)
              : undefined,
          mpesaPhone: paymentMethod === "mpesa" ? mpesaPhone : undefined,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTrackingId(data.trackingId);
        setOrderTotal(total);
        setCompletedPaymentMethod(paymentMethod);
        clearCart();
        setStep(3);
      } else {
        alert(data.message || "Checkout failed. Please try again.");
      }
    } catch (err) {
      console.error("Order error", err);
      alert("Unable to place your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = buildWhatsAppUrl(
    `Hi Patril, I'd like to place an order.\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}, ${city}\n\nItems:\n` +
      items.map((item) => `• ${item.name} (Qty: ${item.qty})`).join("\n") +
      `\n\nTotal: ${formatPrice(total)}`
  );

  if (!hydrated && step !== 3) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] transition-colors duration-300 pb-24">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <DemoModeBanner className="mb-8" />
        {step < 3 && (
          <div className="mb-12 flex justify-between items-center max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-500"}`}>
                1
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider ${step >= 1 ? "text-neutral-900" : "text-neutral-400"}`}>Delivery</span>
            </div>
            <div className="h-px bg-neutral-300 flex-1 mx-4"></div>
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-500"}`}>
                2
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider ${step >= 2 ? "text-neutral-900" : "text-neutral-400"}`}>Payment</span>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <form onSubmit={handleNextStep} className="lg:col-span-7 bg-white border border-neutral-200/60 rounded-3xl p-6 md:p-8 space-y-6 transition-colors">
              <h2 className="text-sm uppercase tracking-wider font-black text-neutral-900 pb-3 border-b border-neutral-100">
                Delivery Details
              </h2>

              {deliveryError && (
                <p className="text-xs font-semibold text-red-600">{deliveryError}</p>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 700 000 000"
                      className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Physical Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Apartment suite, street address"
                    className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Nairobi, Kampala"
                    className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-neutral-900 text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-black active:scale-[0.98] transition shadow-lg"
              >
                Proceed to Payment <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="lg:col-span-5 bg-neutral-100 border border-neutral-200/40 rounded-3xl p-6 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60">
                <h3 className="text-xs uppercase tracking-wider font-black text-neutral-900">
                  Your Order Summary
                </h3>
                <Link
                  href="/cart"
                  className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 hover:text-neutral-900 transition"
                >
                  Edit cart
                </Link>
              </div>
              <div className="divide-y divide-neutral-200/40 py-2 max-h-56 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between py-3 items-center gap-2">
                    <span className="text-xs text-neutral-600 truncate pr-3">
                      {item.name} <span className="text-[10px] font-bold text-neutral-400">x{item.qty}</span>
                    </span>
                    <span className="text-xs font-bold text-neutral-900 shrink-0">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-neutral-200/60 flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider font-bold text-neutral-400">Order Total</span>
                <span className="text-xl font-black text-neutral-950">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 bg-white border border-neutral-200/60 rounded-3xl p-6 md:p-8 space-y-6 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h2 className="text-sm uppercase tracking-wider font-black text-neutral-900">
                  Payment Method
                </h2>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-neutral-400 hover:text-neutral-900 transition"
                >
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition ${
                    paymentMethod === "card"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("mpesa")}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition ${
                    paymentMethod === "mpesa"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> M-Pesa
                </button>
              </div>

              {paymentMethod === "card" ? (
                <>
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-950 p-6 text-white shadow-xl flex flex-col justify-between aspect-[1.58/1] max-w-sm mx-auto">
                    <div className="flex justify-between items-start">
                      <CreditCard className="w-8 h-8 text-neutral-300 stroke-[1.25]" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Patril Card</span>
                    </div>
                    <div className="text-lg tracking-widest font-mono py-4">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="block text-[8px] uppercase tracking-widest text-neutral-500">Holder</span>
                        <span className="text-xs font-bold truncate max-w-[150px] block">{cardName || "YOUR NAME"}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase tracking-widest text-neutral-500">Expiry</span>
                        <span className="text-xs font-bold">{cardExpiry || "MM/YY"}</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleCompleteOrder} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Enter owner name"
                        className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Card Number</label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 1234 5678"
                        className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Expiry Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">CVV Code</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-neutral-900 text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-black active:scale-[0.98] transition shadow-lg disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Confirm Secure Payment"}
                    </button>
                  </form>
                </>
              ) : (
                <form onSubmit={handleCompleteOrder} className="space-y-4">
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      You will receive an M-Pesa STK push on the number below. Confirm the payment of{" "}
                      <span className="font-bold">{formatPrice(total)}</span> to complete your order.
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">M-Pesa Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="+254 700 000 000"
                      className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 text-neutral-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-emerald-600 text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-emerald-700 active:scale-[0.98] transition shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Sending STK Push..." : "Pay with M-Pesa"}
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-5 bg-neutral-100 border border-neutral-200/40 rounded-3xl p-6 space-y-6 transition-colors">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-black text-neutral-900 pb-3 border-b border-neutral-200/60">
                  Pay via WhatsApp
                </h3>
                <p className="text-[10px] text-neutral-500 mt-2.5 leading-relaxed">
                  Skip online inputs. Wire funds directly through local banking or generate a verified WhatsApp purchase proposal to be processed instantly by our operations team.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-transparent border-2 border-emerald-500 text-emerald-500 font-bold uppercase tracking-widest text-[9px] rounded-full hover:bg-emerald-500 hover:text-white transition active:scale-[0.95]"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Order on WhatsApp
                </a>
              </div>
              <div className="h-px bg-neutral-200"></div>
              <div className="space-y-3.5 text-neutral-500 text-[10px] leading-relaxed font-semibold">
                <div className="flex gap-2.5 items-start">
                  <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0 stroke-[1.5]" />
                  <span>Payments encrypted with certified luxury PCI compliance. No card credentials stored.</span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Gift className="w-4 h-4 text-neutral-800 shrink-0 stroke-[1.5]" />
                  <span>Selected items may include free accessories on qualifying orders.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto text-center bg-white border border-neutral-200/60 rounded-3xl p-8 shadow-xl transition-colors py-16 animate-in fade-in zoom-in-95 duration-300">
            <CheckCircle className="w-16 h-16 text-neutral-950 stroke-[1.25] mx-auto mb-6 animate-bounce" />
            <h2 className="text-xl md:text-2xl font-black text-neutral-900 uppercase tracking-tight">Order placed!</h2>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Thanks, <span className="font-semibold text-neutral-800">{name}</span>. We&apos;ve received your order and will be in touch soon.
            </p>

            {SITE.demoMode && (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-relaxed text-amber-950">
                This was a <strong>demo checkout</strong> — no payment was processed. On staging,
                your tracking ID may not work later; use WhatsApp for real orders until we go live.
              </p>
            )}

            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 my-8 text-left text-xs font-semibold text-neutral-600 space-y-2">
              <div className="flex justify-between">
                <span>Receipt Name</span>
                <span className="text-neutral-900">{name}</span>
              </div>
              <div className="flex justify-between">
                <span>Tracking ID</span>
                <span className="text-emerald-500 font-bold font-mono tracking-wider">{trackingId}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="text-neutral-900">{completedPaymentMethod === "mpesa" ? "M-Pesa" : "Card"}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Address</span>
                <span className="text-neutral-900 truncate max-w-[200px]">{address}, {city}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200/60 pt-2 mt-2">
                <span className="text-neutral-400">Total Value Charged</span>
                <span className="text-neutral-900 font-bold">{formatPrice(orderTotal)}</span>
              </div>
            </div>

            <p className="text-[10px] text-neutral-400 mb-8 leading-relaxed max-w-xs mx-auto">
              We&apos;ll call or WhatsApp you at <span className="font-bold">{phone}</span> within 2 hours to confirm delivery details.
            </p>

            <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/track-order?id=${encodeURIComponent(trackingId)}`}
                className="inline-block px-8 py-3 bg-emerald-600 text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-emerald-700 transition active:scale-95 shadow-md"
              >
                Track This Order
              </Link>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-neutral-900 text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-black transition active:scale-95 shadow-md"
              >
                Return Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
