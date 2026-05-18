export const BUYER_FEE_PCT = 0.05;
export const SELLER_FEE_PCT = 0.05;

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function buyerTotal(priceCents: number): number {
  return Math.round(priceCents * (1 + BUYER_FEE_PCT));
}

export function sellerPayout(priceCents: number): number {
  return Math.round(priceCents * (1 - SELLER_FEE_PCT));
}

export function platformEarnings(priceCents: number): number {
  return buyerTotal(priceCents) - sellerPayout(priceCents);
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

export function conditionLabel(c: string): string {
  return (
    {
      new: "New with tags",
      like_new: "Like new",
      good: "Good condition",
      used: "Used",
    } as Record<string, string>
  )[c] ?? c;
}

export function categoryLabel(c: string): string {
  return (
    {
      women: "Women",
      men: "Men",
      kids: "Kids",
      shoes: "Shoes",
      bags: "Bags",
      accessories: "Accessories",
      home: "Home",
    } as Record<string, string>
  )[c] ?? c;
}
