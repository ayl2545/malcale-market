"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sellerPayout, formatPrice } from "@/lib/format";

const CATEGORIES = [
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
  { value: "kids", label: "Kids" },
  { value: "shoes", label: "Shoes" },
  { value: "bags", label: "Bags" },
  { value: "accessories", label: "Accessories" },
  { value: "home", label: "Home" },
];

const CONDITIONS = [
  { value: "new", label: "New with tags", desc: "Unworn, original tags attached" },
  { value: "like_new", label: "Like new", desc: "Worn once or twice, no flaws" },
  { value: "good", label: "Good condition", desc: "Light, normal signs of wear" },
  { value: "used", label: "Used", desc: "Visible wear, still wearable" },
];

export default function NewListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const priceCents = Math.round((Number(priceUsd) || 0) * 100);
  const valid =
    title.length >= 3 &&
    description.length >= 10 &&
    priceCents > 0 &&
    category &&
    condition;

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls].slice(0, 6));
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => router.push("/"), 1500);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold">Listing published!</h1>
        <p className="mt-2 text-[color:var(--muted-foreground)]">
          (Demo: nothing was actually saved.) Redirecting you home…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold">List a new item</h1>
      <p className="mt-1 text-[color:var(--muted-foreground)]">
        Most items get their first message within 24 hours.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <section className="space-y-2">
          <label className="font-semibold">Photos</label>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            First photo is the cover. Add up to 6.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((src, i) => (
              <div
                key={src}
                className="relative aspect-square rounded-xl overflow-hidden bg-[color:var(--muted)] border"
              >
                {}
                <img
                  src={src}
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
            {images.length < 6 && (
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

        <Field label="Title" hint="What is it?">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Vintage Levi's 501 jeans"
            maxLength={80}
            className="w-full h-11 px-4 rounded-lg border bg-white"
          />
        </Field>

        <Field label="Description" hint="Condition details, fit, measurements, anything a buyer should know.">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Be honest — the best listings mention any flaws."
            rows={4}
            className="w-full p-3 rounded-lg border bg-white resize-y"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border bg-white"
            >
              <option value="">Select…</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Brand">
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Optional"
              className="w-full h-11 px-4 rounded-lg border bg-white"
            />
          </Field>
          <Field label="Size">
            <input
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g. M, W27, EU 38"
              className="w-full h-11 px-4 rounded-lg border bg-white"
            />
          </Field>
          <Field label="Price (USD)">
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
                className="w-full h-11 pl-8 pr-4 rounded-lg border bg-white"
              />
            </div>
          </Field>
        </div>

        <section className="space-y-2">
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
                  onChange={(e) => setCondition(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">{c.label}</div>
                  <div className="text-xs text-[color:var(--muted-foreground)]">{c.desc}</div>
                </div>
              </label>
            ))}
          </div>
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
            disabled={!valid}
            className="flex-1 h-12 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            Publish listing
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-semibold text-sm block">{label}</label>
      {hint && <p className="text-xs text-[color:var(--muted-foreground)]">{hint}</p>}
      {children}
    </div>
  );
}
