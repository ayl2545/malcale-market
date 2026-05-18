import Image from "next/image";
import Link from "next/link";
import { orders, getListing, getUser } from "@/lib/mock-data";
import { formatPrice, timeAgo } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const STATUS_LABELS: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Awaiting payment", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Paid · awaiting shipment", color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-700" },
};

export default function OrdersPage() {
  const sorted = orders
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold">My orders</h1>
      <p className="mt-1 text-[color:var(--muted-foreground)]">
        Track purchases and confirm deliveries here.
      </p>

      {sorted.length === 0 ? (
        <div className="mt-8 p-12 text-center border rounded-2xl">
          <p>No orders yet.</p>
          <Link
            href="/"
            className="inline-block mt-3 text-[color:var(--primary)] font-medium"
          >
            Start shopping →
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {sorted.map((o) => {
            const listing = getListing(o.listingId);
            const seller = getUser(o.sellerId);
            if (!listing || !seller) return null;
            const status = STATUS_LABELS[o.status];
            return (
              <article
                key={o.id}
                className="p-4 sm:p-5 rounded-2xl border bg-[color:var(--card)]"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs text-[color:var(--muted-foreground)]">
                      Order #{o.id} · {timeAgo(o.createdAt)}
                    </p>
                    <Link
                      href={`/profile/${seller.username}`}
                      className="text-sm hover:underline"
                    >
                      Sold by {seller.displayName}
                    </Link>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>

                <Link
                  href={`/listings/${listing.id}`}
                  className="mt-3 flex items-center gap-4 group"
                >
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    width={64}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium group-hover:underline truncate">
                      {listing.title}
                    </p>
                    <p className="text-xs text-[color:var(--muted-foreground)]">
                      {listing.brand} · Size {listing.size}
                    </p>
                    <p className="text-sm mt-0.5">
                      {formatPrice(o.price + o.buyerFee)}{" "}
                      <span className="text-xs text-[color:var(--muted-foreground)]">
                        (incl. {formatPrice(o.buyerFee)} fee)
                      </span>
                    </p>
                  </div>
                </Link>

                {o.trackingNumber && (
                  <p className="mt-3 text-xs text-[color:var(--muted-foreground)]">
                    Tracking: <span className="font-mono">{o.trackingNumber}</span>
                  </p>
                )}

                <div className="mt-4 flex gap-2 flex-wrap">
                  {o.status === "shipped" && (
                    <button
                      type="button"
                      className="h-9 px-4 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-sm font-semibold hover:opacity-90"
                    >
                      Confirm delivery
                    </button>
                  )}
                  <Link
                    href={`/inbox`}
                    className="h-9 px-4 inline-flex items-center rounded-full border text-sm font-medium hover:bg-[color:var(--muted)]"
                  >
                    Message seller
                  </Link>
                  {(o.status === "delivered" || o.status === "completed") && (
                    <button
                      type="button"
                      className="h-9 px-4 rounded-full border text-sm font-medium hover:bg-[color:var(--muted)]"
                    >
                      Leave review
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
