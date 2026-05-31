// Facade: prefer Supabase; fall back to mock-data only when Supabase is
// unreachable or returns nothing (useful during the cutover and for
// local dev without env vars).

import { getServerSupabase } from "@/lib/supabase/server";
import {
  fetchListings as sbFetchListings,
  fetchListingById as sbFetchListingById,
  fetchListingsBySeller as sbFetchListingsBySeller,
  fetchProfileByUsername as sbFetchProfileByUsername,
} from "@/lib/supabase/queries";
import {
  listings as mockListings,
  getListing as mockGetListing,
  getUser as mockGetUser,
  getUserByUsername as mockGetUserByUsername,
  listingsBySeller as mockListingsBySeller,
} from "@/lib/mock-data";
import type { Listing, User } from "@/lib/types";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function applyMockFilters(
  items: Listing[],
  opts: {
    category?: string;
    condition?: string;
    minCents?: number;
    maxCents?: number;
    q?: string;
    sort?: "newest" | "price_asc" | "price_desc" | "popular";
  },
): Listing[] {
  let out = items.slice();
  if (opts.category && opts.category !== "all")
    out = out.filter((l) => l.category === opts.category);
  if (opts.condition && opts.condition !== "all")
    out = out.filter((l) => l.condition === opts.condition);
  if (opts.minCents != null) out = out.filter((l) => l.price >= opts.minCents!);
  if (opts.maxCents != null) out = out.filter((l) => l.price <= opts.maxCents!);
  if (opts.q) {
    const q = opts.q.toLowerCase();
    out = out.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.brand.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q),
    );
  }
  switch (opts.sort) {
    case "price_asc":
      out.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      out.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      out.sort((a, b) => b.likes - a.likes);
      break;
    default:
      out.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
  return out;
}

export type ListingFilters = {
  category?: string;
  condition?: string;
  minCents?: number;
  maxCents?: number;
  q?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
};

export async function getListings(opts: ListingFilters = {}): Promise<Listing[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await getServerSupabase();
      const rows = await sbFetchListings(supabase, opts);
      if (rows.length > 0) return rows;
    } catch (e) {
      console.error("Supabase fetchListings failed, falling back to mock:", e);
    }
  }
  return applyMockFilters(mockListings, opts);
}

export async function getListingWithSeller(
  id: string,
): Promise<{ listing: Listing; seller: User } | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await getServerSupabase();
      const result = await sbFetchListingById(supabase, id);
      if (result) return result;
    } catch (e) {
      console.error("Supabase fetchListingById failed:", e);
    }
  }
  const listing = mockGetListing(id);
  if (!listing) return null;
  const seller = mockGetUser(listing.sellerId);
  if (!seller) return null;
  return { listing, seller };
}

export async function getProfileWithListings(
  username: string,
): Promise<{ user: User; listings: Listing[] } | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await getServerSupabase();
      const user = await sbFetchProfileByUsername(supabase, username);
      if (user) {
        const items = await sbFetchListingsBySeller(supabase, user.id);
        return { user, listings: items };
      }
    } catch (e) {
      console.error("Supabase profile fetch failed:", e);
    }
  }
  const user = mockGetUserByUsername(username);
  if (!user) return null;
  return { user, listings: mockListingsBySeller(user.id) };
}
