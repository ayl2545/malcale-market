import type { Delivery } from "@/lib/types";

export function DeliveryBadge({
  delivery,
  pickupLocation,
}: {
  delivery: Delivery;
  pickupLocation?: string;
}) {
  return (
    <div className="mt-4 grid gap-2 text-sm">
      {(delivery === "ship" || delivery === "both") && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-[color:var(--muted)]">
          <span className="text-base">📦</span>
          <div>
            <p className="font-medium">Home delivery</p>
            <p className="text-xs text-[color:var(--muted-foreground)]">
              Shipped to your address. Tracking included.
            </p>
          </div>
        </div>
      )}
      {(delivery === "pickup" || delivery === "both") && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-[color:var(--muted)]">
          <span className="text-base">🤝</span>
          <div>
            <p className="font-medium">
              Local pickup{pickupLocation ? ` · ${pickupLocation}` : ""}
            </p>
            <p className="text-xs text-[color:var(--muted-foreground)]">
              Coordinate with the seller via chat after purchase.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
