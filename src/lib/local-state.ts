"use client";

import type { Listing, Delivery } from "./types";
import { CURRENT_USER_ID } from "./mock-data";

const LISTINGS_KEY = "malcale.userListings";
const PAYOUT_KEY = "malcale.payoutSetup";

export type PayoutSetup = {
  status: "none" | "pending" | "verified";
  method?: "bank" | "paypal";
  bankLast4?: string;
  payoutEmail?: string;
  fullName?: string;
};

export function readUserListings(): Listing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LISTINGS_KEY);
    return raw ? (JSON.parse(raw) as Listing[]) : [];
  } catch {
    return [];
  }
}

export function addUserListing(input: {
  title: string;
  description: string;
  price: number;
  category: Listing["category"];
  condition: Listing["condition"];
  brand: string;
  size: string;
  images: string[];
  delivery: Delivery;
  pickupLocation?: string;
}): Listing {
  const listing: Listing = {
    id: `l_user_${Date.now()}`,
    sellerId: CURRENT_USER_ID,
    title: input.title,
    description: input.description,
    price: input.price,
    category: input.category,
    condition: input.condition,
    brand: input.brand || "—",
    size: input.size || "One size",
    images: input.images.length > 0 ? input.images : [defaultListingImage(input.title)],
    status: "active",
    createdAt: new Date().toISOString(),
    likes: 0,
    delivery: input.delivery,
    pickupLocation: input.pickupLocation,
  };
  const current = readUserListings();
  const next = [listing, ...current];
  window.localStorage.setItem(LISTINGS_KEY, JSON.stringify(next));
  return listing;
}

export function readPayoutSetup(): PayoutSetup {
  if (typeof window === "undefined") return { status: "none" };
  try {
    const raw = window.localStorage.getItem(PAYOUT_KEY);
    return raw ? (JSON.parse(raw) as PayoutSetup) : { status: "none" };
  } catch {
    return { status: "none" };
  }
}

export function writePayoutSetup(setup: PayoutSetup): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PAYOUT_KEY, JSON.stringify(setup));
}

function defaultListingImage(title: string): string {
  const encoded = encodeURIComponent(`Your listing\n\n${title}`);
  return `https://placehold.co/800x1000/e6f5ec/0a5538/png?text=${encoded}&font=playfair`;
}
