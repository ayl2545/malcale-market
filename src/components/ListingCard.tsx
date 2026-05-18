import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/lib/types";
import { formatPrice, conditionLabel } from "@/lib/format";
import { getUser } from "@/lib/mock-data";

export function ListingCard({ listing }: { listing: Listing }) {
  const seller = getUser(listing.sellerId);
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block rounded-xl overflow-hidden bg-[color:var(--card)] border border-[color:var(--border)] hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-[4/5] bg-[color:var(--muted)]">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-[1.02] transition-transform"
        />
        {listing.status === "sold" && (
          <div className="absolute inset-0 bg-black/50 grid place-items-center">
            <span className="bg-white text-black font-bold px-3 py-1 rounded text-sm">
              SOLD
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" />
          </svg>
          {listing.likes}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-bold text-base">{formatPrice(listing.price)}</span>
          <span className="text-xs text-[color:var(--muted-foreground)] truncate">
            {listing.brand}
          </span>
        </div>
        <h3 className="text-sm mt-0.5 line-clamp-2 text-[color:var(--muted-foreground)]">
          {listing.title}
        </h3>
        <div className="flex items-center justify-between mt-2 text-xs text-[color:var(--muted-foreground)]">
          <span>{listing.size}</span>
          <span>·</span>
          <span className="truncate">{conditionLabel(listing.condition)}</span>
          {seller && (
            <>
              <span>·</span>
              <span className="truncate">@{seller.username}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
