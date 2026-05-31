import Image from "next/image";
import Link from "next/link";
import { getListingWithSeller, getProfileWithListings } from "@/lib/data";
import {
  formatPrice,
  buyerTotal,
  conditionLabel,
  categoryLabel,
  timeAgo,
  BUYER_FEE_PCT,
} from "@/lib/format";
import { ImageGallery } from "@/components/ImageGallery";
import { ListingCard } from "@/components/ListingCard";
import { DeliveryBadge } from "@/components/DeliveryBadge";
import { UserListingDetail } from "@/components/UserListingDetail";

export const dynamic = "force-dynamic";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getListingWithSeller(id);

  if (!result) {
    return <UserListingDetail id={id} />;
  }

  const { listing, seller } = result;
  const profile = await getProfileWithListings(seller.username);
  const more = (profile?.listings ?? []).filter((l) => l.id !== listing.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <nav className="text-sm text-[color:var(--muted-foreground)] mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        <span> · </span>
        <Link href={`/?category=${listing.category}`} className="hover:underline">
          {categoryLabel(listing.category)}
        </Link>
        <span> · </span>
        <span className="text-[color:var(--foreground)]">{listing.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <ImageGallery images={listing.images} alt={listing.title} />

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{listing.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-[color:var(--muted-foreground)]">
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
              You pay {formatPrice(buyerTotal(listing.price))} including buyer protection.
            </p>

            <DeliveryBadge
              delivery={listing.delivery}
              pickupLocation={listing.pickupLocation}
            />

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Link
                href={`/checkout/${listing.id}`}
                className="flex-1 inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold hover:opacity-90"
              >
                Buy now
              </Link>
              <Link
                href={`/inbox?listing=${listing.id}`}
                className="flex-1 inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--foreground)] font-semibold hover:bg-[color:var(--muted)]"
              >
                Message seller
              </Link>
            </div>
            <button
              type="button"
              className="mt-2 w-full inline-flex h-10 items-center justify-center gap-2 rounded-full text-sm text-[color:var(--muted-foreground)] hover:bg-[color:var(--muted)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Save · {listing.likes} likes
            </button>
          </div>

          <Link
            href={`/profile/${seller.username}`}
            className="mt-6 flex items-center gap-3 p-4 rounded-2xl border hover:bg-[color:var(--muted)]"
          >
            <Image
              src={seller.avatarUrl}
              alt={seller.displayName}
              width={48}
              height={48}
              className="rounded-full"
              unoptimized
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{seller.displayName}</p>
              <p className="text-sm text-[color:var(--muted-foreground)] truncate">
                @{seller.username}
                {seller.location ? ` · ${seller.location}` : ""}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 text-sm font-medium">
                <span>★</span>
                <span>{seller.rating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-[color:var(--muted-foreground)]">
                {seller.reviewCount} reviews
              </p>
            </div>
          </Link>

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
          </dl>

          <div className="mt-6 p-4 rounded-2xl bg-[color:var(--muted)] text-sm text-[color:var(--muted-foreground)]">
            <p className="font-medium text-[color:var(--foreground)] mb-1">
              Buyer protection included
            </p>
            <p>
              Your payment is held safely until you confirm the item matches the description. If anything is off, we&apos;ll refund you.
            </p>
          </div>
        </div>
      </div>

      {more.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">More from {seller.displayName}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {more.slice(0, 4).map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
