"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { categoryLabel } from "@/lib/format";

const CATEGORIES = [
  "all",
  "women",
  "men",
  "kids",
  "shoes",
  "bags",
  "accessories",
  "home",
] as const;

const CONDITIONS = [
  { value: "all", label: "Any condition" },
  { value: "new", label: "New with tags" },
  { value: "like_new", label: "Like new" },
  { value: "good", label: "Good" },
  { value: "used", label: "Used" },
];

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "popular", label: "Most liked" },
];

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === "" || value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [params, pathname, router],
  );

  const category = params.get("category") ?? "all";
  const condition = params.get("condition") ?? "all";
  const sort = params.get("sort") ?? "newest";
  const minPrice = params.get("min") ?? "";
  const maxPrice = params.get("max") ?? "";

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setParam("category", c)}
              className={`h-9 px-4 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                category === c
                  ? "bg-[color:var(--foreground)] text-[color:var(--background)] border-[color:var(--foreground)]"
                  : "bg-white border-[color:var(--border)] hover:bg-[color:var(--muted)]"
              }`}
            >
              {c === "all" ? "All" : categoryLabel(c)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <select
          value={condition}
          onChange={(e) => setParam("condition", e.target.value)}
          className="h-9 rounded-full border border-[color:var(--border)] bg-white px-3 text-sm"
        >
          {CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <div className="inline-flex items-center gap-1 h-9 rounded-full border border-[color:var(--border)] bg-white px-3 text-sm">
          <span className="text-[color:var(--muted-foreground)]">$</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setParam("min", e.target.value || null)}
            className="w-16 bg-transparent outline-none"
          />
          <span className="text-[color:var(--muted-foreground)]">–</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setParam("max", e.target.value || null)}
            className="w-16 bg-transparent outline-none"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="h-9 rounded-full border border-[color:var(--border)] bg-white px-3 text-sm ml-auto"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
