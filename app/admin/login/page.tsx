"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin/orders");
        router.refresh();
        return;
      }

      setError(data.message || "Login failed.");
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-6 py-16">
      <div className="w-full rounded-3xl border border-neutral-200/60 bg-white p-8 shadow-sm">
        <h1 className="text-sm font-black uppercase tracking-wider text-neutral-900">Admin sign in</h1>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500">
          Internal access for orders and product updates.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-black disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
