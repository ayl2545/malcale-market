import { Suspense } from "react";
import { ListingCard } from "@/components/ListingCard";
import { FilterBar } from "@/components/FilterBar";
import { YourListings } from "@/components/YourListings";
import { listings } from "@/lib/mock-data";
import type { Listing } from "@/lib/types";
import Link from "next/link";

type SearchParams = {
  category?: string;
  condition?: string;
  sort?: string;
  min?: string;
  max?: string;
  q?: string;
};

function applyFilters(items: Listing[], sp: SearchParams): Listing[] {
  let out = items.slice();
  if (sp.category && sp.category !== "all") {
    out = out.filter((l) => l.category === sp.category);
  }
  if (sp.condition && sp.condition !== "all") {
    out = out.filter((l) => l.condition === sp.condition);
  }
  if (sp.min) {
    const min = Number(sp.min) * 100;
    if (!Number.isNaN(min)) out = out.filter((l) => l.price >= min);
  }
  if (sp.max) {
    const max = Number(sp.max) * 100;
    if (!Number.isNaN(max)) out = out.filter((l) => l.price <= max);
  }
  if (sp.q) {
    const q = sp.q.toLowerCase();
    out = out.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.brand.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q),
    );
  }
  switch (sp.sort) {
    case "price_asc":
      out.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      out.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      out.sort((a, b) => b.likes - a.likes);
      break;
    default:
      out.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
  return out;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filtered = applyFilters(listings, sp);
  const heroQuery = sp.q || sp.category;

  return (
    <div>
      {!heroQuery && (
        <section className="bg-gradient-to-br from-[#e6f5ec] via-[color:var(--background)] to-[#fff5d1]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Pre-loved fashion,<br />
                <span className="text-[color:var(--primary)]">priced right.</span>
              </h1>
              <p className="mt-4 text-lg text-[color:var(--muted-foreground)] max-w-xl">
                Buy from real people clearing their closets. Sell what you don&apos;t wear. Keep clothes in circulation a little longer.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/listings/new"
                  className="inline-flex h-11 items-center rounded-full bg-[color:var(--primary)] px-6 text-sm font-semibold text-[color:var(--primary-foreground)] hover:opacity-90"
                >
                  Sell your first item
                </Link>
                <Link
                  href="/?category=women"
                  className="inline-flex h-11 items-center rounded-full border border-[color:var(--foreground)] px-6 text-sm font-semibold hover:bg-[color:var(--muted)]"
                >
                  Shop now
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[color:var(--muted-foreground)]">
                <span>✓ Buyer protection</span>
                <span>✓ Verified members</span>
                <span>✓ 5% flat fee</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {filtered.slice(0, 4).map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Suspense fallback={null}>
        <YourListings />
      </Suspense>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold">
            {sp.q
              ? `Results for "${sp.q}"`
              : sp.category && sp.category !== "all"
                ? `${sp.category.charAt(0).toUpperCase()}${sp.category.slice(1)}`
                : "Fresh listings"}
          </h2>
          <span className="text-sm text-[color:var(--muted-foreground)]">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </span>
        </div>
        <FilterBar />
        {filtered.length === 0 ? (
          <div className="mt-12 text-center py-16 border border-dashed rounded-2xl">
            <p className="text-lg font-medium">No items match these filters</p>
            <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
              Try removing some filters or searching for something else.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-[color:var(--primary)] font-medium"
            >
              Clear all filters →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
            {filtered.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
