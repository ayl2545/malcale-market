import { notFound } from "next/navigation";
import { getListingWithSeller } from "@/lib/data";
import { CheckoutForm } from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  const result = await getListingWithSeller(listingId);
  if (!result) notFound();
  const { listing, seller } = result;

  return (
    <CheckoutForm
      listing={{
        id: listing.id,
        title: listing.title,
        brand: listing.brand,
        size: listing.size,
        price: listing.price,
        image: listing.images[0],
        delivery: listing.delivery,
        pickupLocation: listing.pickupLocation,
      }}
      seller={{ displayName: seller.displayName, username: seller.username }}
    />
  );
}
