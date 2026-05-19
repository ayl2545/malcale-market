"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { readPayoutSetup, writePayoutSetup, type PayoutSetup } from "@/lib/local-state";

export default function PayoutsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-10">Loading…</div>}>
      <PayoutsInner />
    </Suspense>
  );
}

function PayoutsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params.get("return") ?? "/";

  const [setup, setSetup] = useState<PayoutSetup | null>(null);
  const [method, setMethod] = useState<"bank" | "paypal">("bank");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("IL");
  const [bankAccount, setBankAccount] = useState("");
  const [routing, setRouting] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [acceptTos, setAcceptTos] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const s = readPayoutSetup();
    setSetup(s);
    if (s.fullName) setFullName(s.fullName);
    if (s.method) setMethod(s.method);
    if (s.payoutEmail) setPaypalEmail(s.payoutEmail);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      const last4 = bankAccount.slice(-4);
      const next: PayoutSetup = {
        status: "verified",
        method,
        fullName: fullName.trim(),
        bankLast4: method === "bank" ? last4 : undefined,
        payoutEmail: method === "paypal" ? paypalEmail : undefined,
      };
      writePayoutSetup(next);
      setSetup(next);
      setProcessing(false);
      setDone(true);
      setTimeout(() => router.push(returnTo), 1400);
    }, 1200);
  };

  const reset = () => {
    writePayoutSetup({ status: "none" });
    setSetup({ status: "none" });
    setDone(false);
    setFullName("");
    setBankAccount("");
    setRouting("");
    setPaypalEmail("");
    setAcceptTos(false);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-[color:var(--primary)]/10 grid place-items-center text-3xl">
          ✓
        </div>
        <h1 className="text-2xl font-bold mt-4">You&apos;re set up to receive payouts</h1>
        <p className="mt-2 text-[color:var(--muted-foreground)]">
          Taking you back…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-[color:var(--muted-foreground)] mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        <span> · </span>
        <span className="text-[color:var(--foreground)]">Payout settings</span>
      </nav>

      <h1 className="text-3xl font-bold">Receive your money</h1>
      <p className="mt-1 text-[color:var(--muted-foreground)]">
        Tell us where to send the cash when your items sell. Required before you can publish a listing.
      </p>

      {setup?.status === "verified" && (
        <div className="mt-6 p-4 rounded-2xl border bg-[color:var(--primary)]/5 border-[color:var(--primary)]/30">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-[color:var(--primary)] text-white grid place-items-center text-sm font-bold shrink-0">
              ✓
            </div>
            <div className="flex-1">
              <p className="font-semibold">Payouts are active</p>
              <p className="text-sm text-[color:var(--muted-foreground)] mt-0.5">
                {setup.method === "bank"
                  ? `Bank account ending in ${setup.bankLast4 ?? "••••"}`
                  : `PayPal · ${setup.payoutEmail}`}
              </p>
              <p className="text-xs text-[color:var(--muted-foreground)] mt-2">
                Account holder: {setup.fullName}
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="h-9 px-4 rounded-full border text-sm font-medium hover:bg-[color:var(--muted)]"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {setup?.status !== "verified" && (
        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          <div className="rounded-2xl border bg-[color:var(--muted)] p-4 text-sm flex gap-3 items-start">
            <div className="text-2xl">🔒</div>
            <div>
              <p className="font-medium">Demo only — no real banking data is collected.</p>
              <p className="text-[color:var(--muted-foreground)] mt-0.5">
                In production this is where Stripe Connect onboarding would handle ID + bank verification.
              </p>
            </div>
          </div>

          <section className="space-y-2">
            <label className="font-semibold">Payout method</label>
            <div className="grid sm:grid-cols-2 gap-2">
              <MethodCard
                icon="🏦"
                title="Bank transfer"
                desc="3–5 business days, no fees."
                active={method === "bank"}
                onClick={() => setMethod("bank")}
              />
              <MethodCard
                icon="💳"
                title="PayPal"
                desc="Same-day, 2% fee."
                active={method === "paypal"}
                onClick={() => setMethod("paypal")}
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Your details</h2>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full legal name"
              className="w-full h-11 px-4 rounded-lg border bg-white"
            />
            <select
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border bg-white"
            >
              <option value="IL">Israel</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
            </select>
          </section>

          {method === "bank" ? (
            <section className="space-y-3">
              <h2 className="font-semibold">Bank account</h2>
              <input
                required
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ""))}
                placeholder="Account number"
                inputMode="numeric"
                maxLength={20}
                className="w-full h-11 px-4 rounded-lg border bg-white font-mono"
              />
              <input
                required
                value={routing}
                onChange={(e) => setRouting(e.target.value)}
                placeholder="Routing / IBAN / sort code"
                className="w-full h-11 px-4 rounded-lg border bg-white font-mono"
              />
            </section>
          ) : (
            <section className="space-y-3">
              <h2 className="font-semibold">PayPal email</h2>
              <input
                required
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-4 rounded-lg border bg-white"
              />
            </section>
          )}

          <label className="flex items-start gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTos}
              onChange={(e) => setAcceptTos(e.target.checked)}
              className="mt-1"
              required
            />
            <span className="text-[color:var(--muted-foreground)]">
              I confirm the details above are accurate and accept the seller agreement.
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-12 px-6 rounded-full border font-semibold hover:bg-[color:var(--muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing || !acceptTos}
              className="flex-1 h-12 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold disabled:opacity-50 hover:opacity-90"
            >
              {processing ? "Verifying…" : "Save & verify"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function MethodCard({
  icon,
  title,
  desc,
  active,
  onClick,
}: {
  icon: string;
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-xl border ${
        active
          ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5"
          : "hover:bg-[color:var(--muted)]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-xs text-[color:var(--muted-foreground)] mt-1">{desc}</p>
    </button>
  );
}
