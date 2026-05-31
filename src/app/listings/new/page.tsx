"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sellerPayout, formatPrice } from "@/lib/format";
import { addUserListing, readPayoutSetup } from "@/lib/local-state";
import { getBrowserSupabase } from "@/lib/supabase/client";
import type { Category, Condition, Delivery } from "@/lib/types";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
  { value: "kids", label: "Kids" },
  { value: "shoes", label: "Shoes" },
  { value: "bags", label: "Bags" },
  { value: "accessories", label: "Accessories" },
  { value: "home", label: "Home" },
];

const CONDITIONS: { value: Condition; label: string; desc: string }[] = [
  { value: "new", label: "New with tags", desc: "Unworn, original tags attached" },
  { value: "like_new", label: "Like new", desc: "Worn once or twice, no flaws" },
  { value: "good", label: "Good condition", desc: "Light, normal signs of wear" },
  { value: "used", label: "Used", desc: "Visible wear, still wearable" },
];

const DELIVERY_OPTIONS: { value: Delivery; label: string; desc: string; icon: string }[] = [
  { value: "ship", label: "Home delivery", desc: "Buyer pays shipping; you ship the item.", icon: "📦" },
  { value: "pickup", label: "Local pickup", desc: "Buyer collects from a meeting point you choose.", icon: "🤝" },
  { value: "both", label: "Both", desc: "Buyer chooses at checkout.", icon: "🚚" },
];

type Errors = Partial<{
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  delivery: string;
  pickup: string;
  images: string;
}>;

type LocalFile = { file: File; previewUrl: string };

export default function NewListingPage() {
  const router = useRouter();
  const supabase = getBrowserSupabase();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [condition, setCondition] = useState<Condition | "">("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [delivery, setDelivery] = useState<Delivery | "">("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [authState, setAuthState] = useState<"unknown" | "guest" | "user">("unknown");
  const [payoutOk, setPayoutOk] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAuthState(data.user ? "user" : "guest");
    });
    setPayoutOk(readPayoutSetup().status === "verified");
  }, [supabase]);

  const priceCents = Math.round((Number(priceUsd) || 0) * 100);

  const validate = (): Errors => {
    const e: Errors = {};
    if (title.trim().length < 3) e.title = "Add a title (at least 3 characters).";
    if (description.trim().length < 10) e.description = "Describe the item in at least 10 characters.";
    if (priceCents <= 0) e.price = "Set a price greater than $0.";
    if (!category) e.category = "Pick a category.";
    if (!condition) e.condition = "Choose the condition.";
    if (!delivery) e.delivery = "Choose how the buyer will receive the item.";
    if ((delivery === "pickup" || delivery === "both") && pickupLocation.trim().length < 2) {
      e.pickup = "Add a pickup city or area.";
    }
    return e;
  };

  const liveErrors = touched ? validate() : {};

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    const mapped: LocalFile[] = picked.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...mapped].slice(0, 6));
  };

  const removeImage = (idx: number) => {
    setFiles((prev) => {
      const next = prev.slice();
      const [removed] = next.splice(idx, 1);
      URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setSubmitError(null);
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length > 0) {
      document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!payoutOk) {
      router.push("/settings/payouts?return=/listings/new");
      return;
    }

    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        // Guest fallback: still save to localStorage so demo works.
        addUserListing({
          title: title.trim(),
          description: description.trim(),
          price: priceCents,
          category: category as Category,
          condition: condition as Condition,
          brand: brand.trim(),
          size: size.trim(),
          images: files.map((f) => f.previewUrl),
          delivery: delivery as Delivery,
          pickupLocation: pickupLocation.trim() || undefined,
        });
        setSubmitted(true);
        setTimeout(() => router.push("/?published=1"), 1200);
        return;
      }

      const { data: inserted, error: insertErr } = await supabase
        .from("listings")
        .insert({
          seller_id: user.id,
          title: title.trim(),
          description: description.trim(),
          price_cents: priceCents,
          category: category as Category,
          condition: condition as Condition,
          brand: brand.trim(),
          size: size.trim(),
          delivery: delivery as Delivery,
          pickup_location: pickupLocation.trim() || null,
        })
        .select("id")
        .single();
      if (insertErr || !inserted) throw insertErr ?? new Error("Failed to create listing");

      const listingId = inserted.id;

      if (files.length > 0) {
        const uploads = await Promise.all(
          files.map(async ({ file }, i) => {
            const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
            const path = `${user.id}/${listingId}/${i}-${Date.now()}.${ext}`;
            const { error: upErr } = await supabase.storage
              .from("listing-images")
              .upload(path, file, { contentType: file.type, upsert: false });
            if (upErr) throw upErr;
            const { data: pub } = supabase.storage
              .from("listing-images")
              .getPublicUrl(path);
            return { listing_id: listingId, url: pub.publicUrl, sort_order: i };
          }),
        );
        const { error: imgErr } = await supabase.from("listing_images").insert(uploads);
        if (imgErr) throw imgErr;
      }

      setSubmitted(true);
      router.push(`/listings/${listingId}`);
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not publish the listing.");
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-[color:var(--primary)]/10 grid place-items-center text-3xl">
          ✓
        </div>
        <h1 className="text-2xl font-bold mt-4">Listing published!</h1>
        <p className="mt-2 text-[color:var(--muted-foreground)]">Loading your listing…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold">List a new item</h1>
      <p className="mt-1 text-[color:var(--muted-foreground)]">
        Most items get their first message within 24 hours.
      </p>

      {authState === "guest" && (
        <div className="mt-6 p-4 rounded-2xl border border-blue-300 bg-blue-50 text-sm">
          <p className="font-semibold text-blue-900">You&apos;re not logged in</p>
          <p className="mt-1 text-blue-800">
            You can keep filling the form, but it&apos;ll save to your browser only. To list it publicly,{" "}
            <Link href="/signup" className="underline font-semibold">
              create an account
            </Link>{" "}
            or{" "}
            <Link href="/login" className="underline font-semibold">
              log in
            </Link>
            .
          </p>
        </div>
      )}

      {payoutOk === false && (
        <div className="mt-6 p-4 rounded-2xl border border-yellow-300 bg-yellow-50 text-sm">
          <p className="font-semibold text-yellow-900">Set up payouts before you can publish</p>
          <p className="mt-1 text-yellow-800">
            You&apos;ll need to tell us where to send the money when your item sells.
          </p>
          <Link
            href="/settings/payouts?return=/listings/new"
            className="inline-flex items-center mt-2 h-9 px-4 rounded-full bg-yellow-900 text-white text-sm font-semibold"
          >
            Set up payouts →
          </Link>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-6" noValidate>
        <section className="space-y-2">
          <label className="font-semibold">Photos</label>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            First photo is the cover. Add up to 6. (Optional — a placeholder will be used.)
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {files.map((f, i) => (
              <div
                key={f.previewUrl}
                className="relative aspect-square rounded-xl overflow-hidden bg-[color:var(--muted)] border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.previewUrl}
                  alt={`Upload ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 h-6 w-6 grid place-items-center bg-white/90 rounded-full text-xs"
                  aria-label="Remove"
                >
                  ✕
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[10px] bg-[color:var(--primary)] text-white px-1.5 py-0.5 rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}
            {files.length < 6 && (
              <label className="aspect-square rounded-xl border-2 border-dashed grid place-items-center cursor-pointer hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)]">
                <div className="text-center">
                  <div className="text-2xl">+</div>
                  <div className="text-xs">Add photo</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImagePick}
                />
              </label>
            )}
          </div>
        </section>

        <Field label="Title" hint="What is it?" error={liveErrors.title}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Long-sleeve maxi dress"
            maxLength={80}
            className={inputCls(liveErrors.title)}
            data-error={liveErrors.title ? "true" : undefined}
          />
        </Field>

        <Field
          label="Description"
          hint="Condition details, fit, measurements, anything a buyer should know."
          error={liveErrors.description}
        >
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Be honest — the best listings mention any flaws."
            rows={4}
            className={`w-full p-3 rounded-lg border bg-white resize-y ${
              liveErrors.description ? "border-red-500" : ""
            }`}
            data-error={liveErrors.description ? "true" : undefined}
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category" error={liveErrors.category}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={`w-full h-11 px-3 rounded-lg border bg-white ${
                liveErrors.category ? "border-red-500" : ""
              }`}
              data-error={liveErrors.category ? "true" : undefined}
            >
              <option value="">Select…</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Brand">
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Optional"
              className={inputCls()}
            />
          </Field>
          <Field label="Size">
            <input
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g. M, W27, EU 38"
              className={inputCls()}
            />
          </Field>
          <Field label="Price (USD)" error={liveErrors.price}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]">$</span>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="1"
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                placeholder="0.00"
                className={`w-full h-11 pl-8 pr-4 rounded-lg border bg-white ${
                  liveErrors.price ? "border-red-500" : ""
                }`}
                data-error={liveErrors.price ? "true" : undefined}
              />
            </div>
          </Field>
        </div>

        <section className="space-y-2" data-error={liveErrors.condition ? "true" : undefined}>
          <label className="font-semibold">Condition</label>
          <div className="grid sm:grid-cols-2 gap-2">
            {CONDITIONS.map((c) => (
              <label
                key={c.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${
                  condition === c.value
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5"
                    : "hover:bg-[color:var(--muted)]"
                }`}
              >
                <input
                  type="radio"
                  name="condition"
                  value={c.value}
                  checked={condition === c.value}
                  onChange={(e) => setCondition(e.target.value as Condition)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">{c.label}</div>
                  <div className="text-xs text-[color:var(--muted-foreground)]">{c.desc}</div>
                </div>
              </label>
            ))}
          </div>
          {liveErrors.condition && <p className="text-xs text-red-600 mt-1">{liveErrors.condition}</p>}
        </section>

        <section className="space-y-2" data-error={liveErrors.delivery ? "true" : undefined}>
          <label className="font-semibold">How will the buyer receive it?</label>
          <div className="grid sm:grid-cols-3 gap-2">
            {DELIVERY_OPTIONS.map((o) => (
              <label
                key={o.value}
                className={`flex flex-col gap-1 p-3 rounded-lg border cursor-pointer ${
                  delivery === o.value
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5"
                    : "hover:bg-[color:var(--muted)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="delivery"
                    value={o.value}
                    checked={delivery === o.value}
                    onChange={(e) => setDelivery(e.target.value as Delivery)}
                  />
                  <span className="text-base">{o.icon}</span>
                  <span className="font-medium text-sm">{o.label}</span>
                </div>
                <p className="text-xs text-[color:var(--muted-foreground)] ml-6">{o.desc}</p>
              </label>
            ))}
          </div>
          {liveErrors.delivery && <p className="text-xs text-red-600 mt-1">{liveErrors.delivery}</p>}
          {(delivery === "pickup" || delivery === "both") && (
            <Field
              label="Pickup city / area"
              hint="Buyers see this on the listing so they know where to meet you."
              error={liveErrors.pickup}
            >
              <input
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g. Tel Aviv, Florentin area"
                className={inputCls(liveErrors.pickup)}
                data-error={liveErrors.pickup ? "true" : undefined}
              />
            </Field>
          )}
        </section>

        {priceCents > 0 && (
          <div className="p-4 rounded-2xl bg-[color:var(--muted)] text-sm">
            <div className="flex justify-between">
              <span>Item price</span>
              <span>{formatPrice(priceCents)}</span>
            </div>
            <div className="flex justify-between text-[color:var(--muted-foreground)]">
              <span>Platform fee (5%)</span>
              <span>−{formatPrice(priceCents - sellerPayout(priceCents))}</span>
            </div>
            <div className="flex justify-between font-semibold mt-1 pt-2 border-t">
              <span>You receive</span>
              <span>{formatPrice(sellerPayout(priceCents))}</span>
            </div>
          </div>
        )}

        {touched && Object.keys(errors).length > 0 && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            Please fix the highlighted fields above.
          </div>
        )}

        {submitError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {submitError}
          </div>
        )}

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
            disabled={submitting}
            className="flex-1 h-12 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold hover:opacity-90 disabled:opacity-70"
          >
            {submitting
              ? "Publishing…"
              : payoutOk
                ? "Publish listing"
                : "Set up payouts to publish"}
          </button>
        </div>
      </form>
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full h-11 px-4 rounded-lg border bg-white ${error ? "border-red-500" : ""}`;
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-semibold text-sm block">{label}</label>
      {hint && <p className="text-xs text-[color:var(--muted-foreground)]">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
