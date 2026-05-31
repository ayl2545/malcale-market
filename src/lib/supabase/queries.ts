import type { Database } from "./database.types";
import type { Listing, User } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type DB = SupabaseClient<Database>;

type ListingRow = Database["public"]["Tables"]["listings"]["Row"] & {
  listing_images: Pick<
    Database["public"]["Tables"]["listing_images"]["Row"],
    "url" | "sort_order"
  >[];
};

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

const LISTING_SELECT =
  "*, listing_images(url, sort_order)";

function listingFromRow(row: ListingRow): Listing {
  const images = (row.listing_images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.url);
  return {
    id: row.id,
    sellerId: row.seller_id,
    title: row.title,
    description: row.description,
    price: row.price_cents,
    category: row.category,
    condition: row.condition,
    brand: row.brand ?? "",
    size: row.size ?? "",
    status: row.status,
    delivery: row.delivery,
    pickupLocation: row.pickup_location ?? undefined,
    images: images.length ? images : ["/listing-placeholder.svg"],
    createdAt: row.created_at,
    likes: row.likes,
  };
}

function userFromProfile(p: ProfileRow): User {
  return {
    id: p.id,
    username: p.username,
    displayName: p.display_name,
    avatarUrl:
      p.avatar_url ??
      `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(p.username)}`,
    bio: p.bio ?? "",
    rating: Number(p.rating),
    reviewCount: p.review_count,
    joinedAt: p.created_at,
    location: p.location ?? "",
  };
}

export async function fetchListings(
  db: DB,
  opts: {
    category?: string;
    condition?: string;
    minCents?: number;
    maxCents?: number;
    q?: string;
    sort?: "newest" | "price_asc" | "price_desc" | "popular";
    limit?: number;
  } = {},
): Promise<Listing[]> {
  let query = db
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "active");

  if (opts.category && opts.category !== "all") {
    query = query.eq(
      "category",
      opts.category as Database["public"]["Tables"]["listings"]["Row"]["category"],
    );
  }
  if (opts.condition && opts.condition !== "all") {
    query = query.eq(
      "condition",
      opts.condition as Database["public"]["Tables"]["listings"]["Row"]["condition"],
    );
  }
  if (opts.minCents != null) query = query.gte("price_cents", opts.minCents);
  if (opts.maxCents != null) query = query.lte("price_cents", opts.maxCents);
  if (opts.q)
    query = query.or(
      `title.ilike.%${opts.q}%,brand.ilike.%${opts.q}%,description.ilike.%${opts.q}%`,
    );

  switch (opts.sort) {
    case "price_asc":
      query = query.order("price_cents", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_cents", { ascending: false });
      break;
    case "popular":
      query = query.order("likes", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data as ListingRow[]).map(listingFromRow);
}

export async function fetchListingById(
  db: DB,
  id: string,
): Promise<{ listing: Listing; seller: User } | null> {
  const { data, error } = await db
    .from("listings")
    .select(`${LISTING_SELECT}, seller:profiles!seller_id(*)`)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as ListingRow & { seller: ProfileRow };
  return { listing: listingFromRow(row), seller: userFromProfile(row.seller) };
}

export async function fetchListingsBySeller(
  db: DB,
  sellerId: string,
): Promise<Listing[]> {
  const { data, error } = await db
    .from("listings")
    .select(LISTING_SELECT)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ListingRow[]).map(listingFromRow);
}

export async function fetchProfileByUsername(
  db: DB,
  username: string,
): Promise<User | null> {
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return data ? userFromProfile(data) : null;
}

export async function fetchProfileById(
  db: DB,
  id: string,
): Promise<User | null> {
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? userFromProfile(data) : null;
}
