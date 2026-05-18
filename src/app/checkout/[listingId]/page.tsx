import { notFound } from "next/navigation";
import { getListing, getUser, listings } from "@/lib/mock-data";
import { CheckoutForm } from "@/components/CheckoutForm";

export async function generateStaticParams() {
  return listings.map((l) => ({ listingId: l.id }));
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  const listing = getListing(listingId);
  if (!listing) notFound();
  const seller = getUser(listing.sellerId);
  if (!seller) notFound();

  return (
    <CheckoutForm
      listing={{
        id: listing.id,
        title: listing.title,
        brand: listing.brand,
        size: listing.size,
        price: listing.price,
        image: listing.images[0],
      }}
      seller={{ displayName: seller.displayName, username: seller.username }}
    />
  );
}
