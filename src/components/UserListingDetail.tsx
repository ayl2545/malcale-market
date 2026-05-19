"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { readUserListings } from "@/lib/local-state";
import { getUser, CURRENT_USER_ID } from "@/lib/mock-data";
import {
  formatPrice,
  buyerTotal,
  conditionLabel,
  categoryLabel,
  timeAgo,
  BUYER_FEE_PCT,
} from "@/lib/format";
import { ImageGallery } from "@/components/ImageGallery";
import { DeliveryBadge } from "@/components/DeliveryBadge";
import type { Listing } from "@/lib/types";

export function UserListingDetail({ id }: { id: string }) {
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null | "missing">(null);

  useEffect(() => {
    const found = readUserListings().find((l) => l.id === id);
    setListing(found ?? "missing");
  }, [id]);

  if (listing === null) {
    return <div className="mx-auto max-w-2xl px-4 py-12 text-center text-[color:var(--muted-foreground)]">Loading…</div>;
  }

  if (listing === "missing") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <p className="mt-2 text-[color:var(--muted-foreground)]">
          This listing may have been removed or was only saved on another device.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-[color:var(--primary)] font-medium"
        >
          Back to home →
        </Link>
      </div>
    );
  }

  const seller = getUser(listing.sellerId) ?? getUser(CURRENT_USER_ID)!;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <nav className="text-sm text-[color:var(--muted-foreground)] mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        <span> · </span>
        <span className="text-[color:var(--foreground)]">{listing.title}</span>
      </nav>

      <div className="mb-4 p-3 rounded-xl bg-[color:var(--muted)] text-xs text-[color:var(--muted-foreground)]">
        This is one of your own listings. Saved on this device for the demo.
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <ImageGallery images={listing.images} alt={listing.title} />

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{listing.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-[color:var(--muted-foreground)] flex-wrap">
            <span>{listing.brand}</span>
            <span>·</span>
            <span>Size {listing.size}</span>
            <span>·</span>
            <span>{conditionLabel(listing.condition)}</span>
          </div>

          <div className="mt-6 p-4 rounded-2xl border bg-[color:var(--card)]">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">{formatPrice(listing.price)}</span>
              <span className="text-sm text-[color:var(--muted-foreground)]">
                + {(BUYER_FEE_PCT * 100).toFixed(0)}% buyer fee
              </span>
            </div>
            <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
              Buyers pay {formatPrice(buyerTotal(listing.price))} including protection.
            </p>
            <DeliveryBadge
              delivery={listing.delivery}
              pickupLocation={listing.pickupLocation}
            />

            <button
              type="button"
              onClick={() => router.push("/listings/new")}
              className="mt-4 w-full h-11 rounded-full border font-semibold hover:bg-[color:var(--muted)]"
            >
              List another item
            </button>
          </div>

          <section className="mt-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line text-[color:var(--muted-foreground)]">
              {listing.description}
            </p>
          </section>

          <dl className="mt-6 grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-[color:var(--muted-foreground)]">Brand</dt>
            <dd className="text-right">{listing.brand}</dd>
            <dt className="text-[color:var(--muted-foreground)]">Size</dt>
            <dd className="text-right">{listing.size}</dd>
            <dt className="text-[color:var(--muted-foreground)]">Condition</dt>
            <dd className="text-right">{conditionLabel(listing.condition)}</dd>
            <dt className="text-[color:var(--muted-foreground)]">Category</dt>
            <dd className="text-right">{categoryLabel(listing.category)}</dd>
            <dt className="text-[color:var(--muted-foreground)]">Listed</dt>
            <dd className="text-right">{timeAgo(listing.createdAt)}</dd>
            <dt className="text-[color:var(--muted-foreground)]">Seller</dt>
            <dd className="text-right flex items-center justify-end gap-2">
              <Image
                src={seller.avatarUrl}
                alt={seller.displayName}
                width={20}
                height={20}
                className="rounded-full"
                unoptimized
              />
              <span>{seller.displayName} (you)</span>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
