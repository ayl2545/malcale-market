"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { readUserListings } from "@/lib/local-state";
import type { Listing } from "@/lib/types";
import Link from "next/link";

export function YourListings() {
  const params = useSearchParams();
  const [items, setItems] = useState<Listing[]>([]);
  const justPublished = params.get("published") === "1";
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setItems(readUserListings());
    if (justPublished) {
      setShowBanner(true);
      const t = setTimeout(() => setShowBanner(false), 6000);
      return () => clearTimeout(t);
    }
  }, [justPublished]);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
      {showBanner && (
        <div className="mb-4 p-3 rounded-xl bg-[color:var(--primary)]/10 border border-[color:var(--primary)]/30 text-sm flex items-center gap-3">
          <span className="text-lg">🎉</span>
          <span>
            Your listing is live. Buyers can see it on your{" "}
            <Link href="/profile/you" className="underline font-medium">
              profile
            </Link>
            .
          </span>
        </div>
      )}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold">
          Your listings <span className="text-[color:var(--muted-foreground)] font-normal">({items.length})</span>
        </h2>
        <span className="text-xs text-[color:var(--muted-foreground)]">
          Saved on this device · demo
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </section>
  );
}
