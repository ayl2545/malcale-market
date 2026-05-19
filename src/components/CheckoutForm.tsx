"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, buyerTotal, BUYER_FEE_PCT } from "@/lib/format";
import type { Delivery } from "@/lib/types";

type Listing = {
  id: string;
  title: string;
  brand: string;
  size: string;
  price: number;
  image: string;
  delivery: Delivery;
  pickupLocation?: string;
};

const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard", days: "5–7 days", cents: 500 },
  { id: "express", label: "Express", days: "2–3 days", cents: 1200 },
];

type Step = "method" | "address" | "payment" | "done";

export function CheckoutForm({
  listing,
  seller,
}: {
  listing: Listing;
  seller: { displayName: string; username: string };
}) {
  const supportsShip = listing.delivery === "ship" || listing.delivery === "both";
  const supportsPickup = listing.delivery === "pickup" || listing.delivery === "both";
  const offersChoice = listing.delivery === "both";

  const [method, setMethod] = useState<"ship" | "pickup">(
    supportsShip ? "ship" : "pickup",
  );
  const initialStep: Step = offersChoice ? "method" : method === "ship" ? "address" : "payment";
  const [step, setStep] = useState<Step>(initialStep);
  const [shipping, setShipping] = useState("standard");

  const shippingCents = method === "ship"
    ? SHIPPING_OPTIONS.find((o) => o.id === shipping)!.cents
    : 0;
  const buyerFee = Math.round(listing.price * BUYER_FEE_PCT);
  const total = listing.price + buyerFee + shippingCents;

  const goAfterMethod = (m: "ship" | "pickup") => {
    setMethod(m);
    setStep(m === "ship" ? "address" : "payment");
  };

  const steps: Step[] = offersChoice
    ? method === "ship"
      ? ["method", "address", "payment", "done"]
      : ["method", "payment", "done"]
    : method === "ship"
      ? ["address", "payment", "done"]
      : ["payment", "done"];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[1fr_360px] gap-8">
      <div>
        <h1 className="text-3xl font-bold">Checkout</h1>
        <ol className="mt-4 mb-8 flex gap-2 text-sm">
          {steps.slice(0, -1).map((s, i) => {
            const labels: Record<Step, string> = {
              method: "Delivery",
              address: "Address",
              payment: "Payment",
              done: "Confirmed",
            };
            const currentIdx = steps.indexOf(step);
            return (
              <StepIndicator
                key={s}
                n={i + 1}
                label={labels[s]}
                active={step === s}
                done={currentIdx > i}
              />
            );
          })}
        </ol>

        {step === "method" && (
          <MethodPicker
            listing={listing}
            onPick={goAfterMethod}
          />
        )}
        {step === "address" && (
          <AddressForm onSubmit={() => setStep("payment")} onBack={offersChoice ? () => setStep("method") : undefined} />
        )}
        {step === "payment" && (
          <PaymentForm
            total={total}
            method={method}
            shipping={shipping}
            setShipping={setShipping}
            onBack={
              method === "ship"
                ? () => setStep("address")
                : offersChoice
                  ? () => setStep("method")
                  : undefined
            }
            onPay={() => setStep("done")}
          />
        )}
        {step === "done" && (
          <Confirmation
            orderId={`o_${Date.now().toString(36)}`}
            method={method}
            pickupLocation={listing.pickupLocation}
            sellerName={seller.displayName}
          />
        )}
      </div>

      <aside className="bg-[color:var(--card)] border rounded-2xl p-5 h-fit lg:sticky lg:top-20">
        <h2 className="font-semibold mb-4">Order summary</h2>
        <div className="flex gap-3 pb-4 border-b">
          <Image
            src={listing.image}
            alt={listing.title}
            width={72}
            height={90}
            className="rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{listing.title}</p>
            <p className="text-xs text-[color:var(--muted-foreground)]">
              {listing.brand} · Size {listing.size}
            </p>
            <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
              from{" "}
              <Link href={`/profile/${seller.username}`} className="underline">
                {seller.displayName}
              </Link>
            </p>
          </div>
          <p className="font-semibold text-sm shrink-0">{formatPrice(listing.price)}</p>
        </div>
        <div className="py-3 text-xs text-[color:var(--muted-foreground)] border-b">
          {method === "ship" ? (
            <>📦 Home delivery</>
          ) : (
            <>🤝 Local pickup{listing.pickupLocation ? ` · ${listing.pickupLocation}` : ""}</>
          )}
          {offersChoice && step !== "method" && (
            <button
              onClick={() => setStep("method")}
              className="ml-2 underline"
            >
              change
            </button>
          )}
        </div>
        <dl className="py-4 space-y-2 text-sm border-b">
          <Row label="Item" value={formatPrice(listing.price)} />
          <Row
            label={`Buyer protection (${(BUYER_FEE_PCT * 100).toFixed(0)}%)`}
            value={formatPrice(buyerFee)}
          />
          <Row
            label={method === "ship" ? "Shipping" : "Pickup"}
            value={method === "ship" ? formatPrice(shippingCents) : "Free"}
          />
        </dl>
        <div className="pt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <p className="mt-4 text-xs text-[color:var(--muted-foreground)]">
          {method === "ship"
            ? "Funds are held until you confirm the item arrived as described."
            : "Funds are held until you confirm pickup with the seller."}
        </p>
      </aside>
    </div>
  );
}

function MethodPicker({
  listing,
  onPick,
}: {
  listing: Listing;
  onPick: (m: "ship" | "pickup") => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">How do you want to receive it?</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onPick("ship")}
          className="text-left p-4 rounded-2xl border hover:border-[color:var(--primary)] hover:bg-[color:var(--primary)]/5"
        >
          <div className="text-2xl">📦</div>
          <p className="font-semibold mt-2">Home delivery</p>
          <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
            Shipped tracked to your address. 2–7 days.
          </p>
          <p className="text-sm font-semibold mt-2">From $5</p>
        </button>
        <button
          type="button"
          onClick={() => onPick("pickup")}
          className="text-left p-4 rounded-2xl border hover:border-[color:var(--primary)] hover:bg-[color:var(--primary)]/5"
        >
          <div className="text-2xl">🤝</div>
          <p className="font-semibold mt-2">Local pickup</p>
          <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
            Meet the seller in{" "}
            <span className="font-medium text-[color:var(--foreground)]">
              {listing.pickupLocation ?? "their area"}
            </span>
            .
          </p>
          <p className="text-sm font-semibold mt-2">Free</p>
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[color:var(--muted-foreground)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function StepIndicator({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <li
      className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-full text-xs sm:text-sm ${
        active
          ? "bg-[color:var(--foreground)] text-[color:var(--background)]"
          : done
            ? "bg-[color:var(--primary)]/10 text-[color:var(--primary)]"
            : "bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
      }`}
    >
      <span
        className={`h-5 w-5 grid place-items-center rounded-full text-[10px] font-bold ${
          active
            ? "bg-[color:var(--background)] text-[color:var(--foreground)]"
            : done
              ? "bg-[color:var(--primary)] text-white"
              : "bg-[color:var(--border)]"
        }`}
      >
        {done ? "✓" : n}
      </span>
      <span className="font-medium">{label}</span>
    </li>
  );
}

function AddressForm({
  onSubmit,
  onBack,
}: {
  onSubmit: () => void;
  onBack?: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold">Where should we ship it?</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <input required placeholder="Full name" className="h-11 px-4 rounded-lg border bg-white sm:col-span-2" />
        <input required placeholder="Address line 1" className="h-11 px-4 rounded-lg border bg-white sm:col-span-2" />
        <input placeholder="Address line 2 (optional)" className="h-11 px-4 rounded-lg border bg-white sm:col-span-2" />
        <input required placeholder="City" className="h-11 px-4 rounded-lg border bg-white" />
        <input required placeholder="Postal code" className="h-11 px-4 rounded-lg border bg-white" />
        <input required placeholder="Country" className="h-11 px-4 rounded-lg border bg-white sm:col-span-2" />
      </div>
      <div className="flex gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="h-12 px-6 rounded-full border font-semibold hover:bg-[color:var(--muted)]"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className="flex-1 h-12 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold hover:opacity-90"
        >
          Continue to payment
        </button>
      </div>
    </form>
  );
}

function PaymentForm({
  total,
  method,
  shipping,
  setShipping,
  onBack,
  onPay,
}: {
  total: number;
  method: "ship" | "pickup";
  shipping: string;
  setShipping: (s: string) => void;
  onBack?: () => void;
  onPay: () => void;
}) {
  const [processing, setProcessing] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(onPay, 1200);
      }}
      className="space-y-6"
    >
      {method === "ship" && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Shipping speed</h2>
          <div className="grid gap-2">
            {SHIPPING_OPTIONS.map((o) => (
              <label
                key={o.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                  shipping === o.id
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5"
                    : "hover:bg-[color:var(--muted)]"
                }`}
              >
                <input
                  type="radio"
                  checked={shipping === o.id}
                  onChange={() => setShipping(o.id)}
                />
                <div className="flex-1">
                  <p className="font-medium">{o.label}</p>
                  <p className="text-xs text-[color:var(--muted-foreground)]">{o.days}</p>
                </div>
                <span className="font-semibold">{formatPrice(o.cents)}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-3">Payment details</h2>
        <p className="text-xs text-[color:var(--muted-foreground)] mb-3">
          Demo only — no real charges. Mock Stripe Connect would handle this in production.
        </p>
        <div className="space-y-3">
          <input
            required
            placeholder="Card number"
            className="w-full h-11 px-4 rounded-lg border bg-white font-mono"
          />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="MM / YY" className="h-11 px-4 rounded-lg border bg-white" />
            <input required placeholder="CVC" className="h-11 px-4 rounded-lg border bg-white" />
          </div>
          <input
            required
            placeholder="Name on card"
            className="w-full h-11 px-4 rounded-lg border bg-white"
          />
        </div>
      </section>

      <div className="flex gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="h-12 px-6 rounded-full border font-semibold hover:bg-[color:var(--muted)]"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={processing}
          className="flex-1 h-12 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold disabled:opacity-70"
        >
          {processing ? "Processing…" : `Pay ${formatPrice(total)}`}
        </button>
      </div>
    </form>
  );
}

function Confirmation({
  orderId,
  method,
  pickupLocation,
  sellerName,
}: {
  orderId: string;
  method: "ship" | "pickup";
  pickupLocation?: string;
  sellerName: string;
}) {
  return (
    <div className="text-center py-10">
      <div className="mx-auto h-16 w-16 rounded-full bg-[color:var(--primary)]/10 grid place-items-center text-3xl">
        ✓
      </div>
      <h2 className="text-2xl font-bold mt-4">Order placed</h2>
      <p className="mt-2 text-[color:var(--muted-foreground)]">
        Confirmation #{orderId}.{" "}
        {method === "ship"
          ? `${sellerName} will ship within 5 days.`
          : `${sellerName} will message you to coordinate pickup${pickupLocation ? ` in ${pickupLocation}` : ""}.`}
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/orders"
          className="h-11 px-6 inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold hover:opacity-90"
        >
          View orders
        </Link>
        <Link
          href="/"
          className="h-11 px-6 inline-flex items-center justify-center rounded-full border font-semibold hover:bg-[color:var(--muted)]"
        >
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
