import type {
  Conversation,
  Listing,
  Message,
  Order,
  User,
} from "./types";

const img = (id: string, w = 800, h = 1000) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

type Palette = "sand" | "sage" | "cream" | "lavender" | "blush" | "stone";

const palettes: Record<Palette, [string, string]> = {
  sand: ["f5e6d3", "78350f"],
  sage: ["e6f5ec", "0a5538"],
  cream: ["fff5d1", "78350f"],
  lavender: ["ede9fe", "312e81"],
  blush: ["fce7f3", "831843"],
  stone: ["f5f1ea", "1f1d18"],
};

const card = (brand: string, title: string, palette: Palette = "stone") => {
  const [bg, fg] = palettes[palette];
  const text = encodeURIComponent(`${brand}\n\n${title}`);
  return `https://placehold.co/800x1000/${bg}/${fg}/png?text=${text}&font=playfair`;
};

const avatar = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=ffd84d,fef08a,bbf7d0,fecaca,bfdbfe`;

export const CURRENT_USER_ID = "u_me";

export const users: User[] = [
  {
    id: "u_me",
    username: "you",
    displayName: "You",
    avatarUrl: avatar("you"),
    bio: "Curating my closet — quality over quantity.",
    rating: 4.9,
    reviewCount: 42,
    joinedAt: "2024-08-12",
    location: "Bnei Brak, IL",
  },
  {
    id: "u_maya",
    username: "maya.thrift",
    displayName: "Maya",
    avatarUrl: avatar("maya"),
    bio: "Modest vintage finds. Long sleeves and longer skirts. Ships same day.",
    rating: 4.95,
    reviewCount: 218,
    joinedAt: "2023-02-04",
    location: "Brooklyn, NY",
  },
  {
    id: "u_noa",
    username: "noa.closet",
    displayName: "Noa Levi",
    avatarUrl: avatar("noa"),
    bio: "Selling pieces I never wore. All authentic, all tznius.",
    rating: 4.8,
    reviewCount: 87,
    joinedAt: "2024-01-19",
    location: "Jerusalem, IL",
  },
  {
    id: "u_dani",
    username: "dani.kicks",
    displayName: "Dani",
    avatarUrl: avatar("dani"),
    bio: "Sneakerhead. Only deadstock or worn 1-2x.",
    rating: 4.7,
    reviewCount: 156,
    joinedAt: "2023-09-22",
    location: "London, UK",
  },
  {
    id: "u_rina",
    username: "rina.kids",
    displayName: "Rina",
    avatarUrl: avatar("rina"),
    bio: "Mom of 3. Lightly worn kids' clothes, great prices.",
    rating: 5.0,
    reviewCount: 64,
    joinedAt: "2024-04-10",
    location: "Tel Aviv, IL",
  },
];

export const listings: Listing[] = [
  {
    id: "l_001",
    sellerId: "u_maya",
    title: "High-rise straight-leg jeans",
    description:
      "Classic high-rise straight cut in dark wash. Bought in 2024, worn maybe 10 times. Hemmed to 30\" inseam (covers the ankle). No stains, no rips — just the perfect amount of fade on the front.",
    price: 4200,
    category: "women",
    condition: "good",
    brand: "Levi's",
    size: "W27",
    images: [
      card("Levi's", "High-rise straight-leg jeans", "stone"),
      card("Levi's", "Dark wash · W27", "sand"),
    ],
    status: "active",
    createdAt: "2026-05-14T10:12:00Z",
    likes: 38,
    delivery: "both",
    pickupLocation: "Brooklyn, NY",
  },
  {
    id: "l_002",
    sellerId: "u_dani",
    title: "Nike Air Max 90 — Infrared",
    description:
      "OG colorway, retail $130. Worn 3 times, kept in box with original tissue paper. Size US 10 / EU 44. Comes with extra laces.",
    price: 7800,
    category: "shoes",
    condition: "like_new",
    brand: "Nike",
    size: "US 10",
    images: [
      img("1542291026-7eec264c27ff"),
      img("1606107557195-0e29a4b5b4aa"),
    ],
    status: "active",
    createdAt: "2026-05-15T08:30:00Z",
    likes: 92,
    delivery: "ship",
  },
  {
    id: "l_003",
    sellerId: "u_noa",
    title: "Acne Studios long-sleeve wool sweater",
    description:
      "Cream merino wool, oversized fit, high crew neckline, full long sleeves to the wrist. Tag still attached — was a gift in wrong size. Original price €280.",
    price: 9500,
    category: "women",
    condition: "new",
    brand: "Acne Studios",
    size: "M",
    images: [
      card("Acne Studios", "Long-sleeve wool sweater", "cream"),
      card("Acne Studios", "Merino · oversized · cream", "stone"),
    ],
    status: "active",
    createdAt: "2026-05-16T14:45:00Z",
    likes: 51,
    delivery: "ship",
  },
  {
    id: "l_004",
    sellerId: "u_maya",
    title: "Hip-length wool blazer",
    description:
      "Tailored single-breasted blazer, hits at the hip. Notch lapel, full long sleeves. Light wear on the lining only. Layers beautifully over a long dress or skirt.",
    price: 9000,
    category: "women",
    condition: "good",
    brand: "Massimo Dutti",
    size: "S",
    images: [
      card("Massimo Dutti", "Wool blazer · hip length", "stone"),
      card("Massimo Dutti", "Notch lapel · long sleeve", "sand"),
    ],
    status: "active",
    createdAt: "2026-05-10T17:20:00Z",
    likes: 124,
    delivery: "both",
    pickupLocation: "Brooklyn, NY",
  },
  {
    id: "l_005",
    sellerId: "u_rina",
    title: "Kids' raincoat 4-5 yrs",
    description:
      "Bright yellow, fully waterproof, hooded, full long sleeves and longer hem covering the knees. Outgrown after one season. Smoke-free, pet-free home.",
    price: 1800,
    category: "kids",
    condition: "like_new",
    brand: "Polarn O. Pyret",
    size: "4-5Y",
    images: [card("Polarn O. Pyret", "Kids' raincoat · 4–5Y", "cream")],
    status: "active",
    createdAt: "2026-05-17T09:00:00Z",
    likes: 9,
    delivery: "pickup",
    pickupLocation: "Tel Aviv, IL",
  },
  {
    id: "l_006",
    sellerId: "u_noa",
    title: "Coach leather crossbody",
    description:
      "Tan pebbled leather, gold hardware. Authentic — comes with original dust bag. Tiny scratch on back, not visible when worn.",
    price: 8500,
    category: "bags",
    condition: "good",
    brand: "Coach",
    size: "One size",
    images: [img("1495121605193-b116b5b9c5fe")],
    status: "active",
    createdAt: "2026-05-13T11:00:00Z",
    likes: 67,
    delivery: "ship",
  },
  {
    id: "l_007",
    sellerId: "u_dani",
    title: "Adidas Sambas — black/white",
    description:
      "Worn maybe 5 times total. The toe is clean, gum sole still has the unmistakable smell of new shoes.",
    price: 5500,
    category: "shoes",
    condition: "like_new",
    brand: "Adidas",
    size: "US 9",
    images: [img("1539109136881-3be0616acf4b")],
    status: "active",
    createdAt: "2026-05-16T19:30:00Z",
    likes: 73,
    delivery: "ship",
  },
  {
    id: "l_008",
    sellerId: "u_maya",
    title: "Long-sleeve modest maxi dress",
    description:
      "100% viscose, long-sleeve to the wrist, high crew neck, ankle-length. Champagne color. Perfect for shabbat or events. Wore to one wedding. Dry cleaned, ready to ship.",
    price: 6800,
    category: "women",
    condition: "like_new",
    brand: "Reformation",
    size: "S",
    images: [
      card("Reformation", "Long-sleeve maxi dress", "sage"),
      card("Reformation", "Champagne · ankle length", "sand"),
    ],
    status: "active",
    createdAt: "2026-05-12T16:00:00Z",
    likes: 88,
    delivery: "both",
    pickupLocation: "Brooklyn, NY",
  },
  {
    id: "l_009",
    sellerId: "u_noa",
    title: "Wool overcoat, camel · ankle length",
    description:
      "70% wool, 30% cashmere. Bought last winter, decided it wasn't my color. Beautifully tailored, hits below the knee, deep pockets, full long sleeves.",
    price: 14500,
    category: "women",
    condition: "like_new",
    brand: "Massimo Dutti",
    size: "M",
    images: [
      card("Massimo Dutti", "Wool overcoat · camel", "sand"),
      card("Massimo Dutti", "Below-knee length", "stone"),
    ],
    status: "active",
    createdAt: "2026-05-09T13:00:00Z",
    likes: 156,
    delivery: "ship",
  },
  {
    id: "l_010",
    sellerId: "u_rina",
    title: "Toddler sneakers, navy",
    description:
      "Velcro closure, soft sole. Size EU 24. Worn maybe 4 weeks before being outgrown.",
    price: 1500,
    category: "kids",
    condition: "good",
    brand: "Geox",
    size: "EU 24",
    images: [card("Geox", "Toddler sneakers · EU 24", "lavender")],
    status: "active",
    createdAt: "2026-05-15T07:15:00Z",
    likes: 4,
    delivery: "pickup",
    pickupLocation: "Tel Aviv, IL",
  },
  {
    id: "l_011",
    sellerId: "u_dani",
    title: "Carhartt Detroit jacket · hip length",
    description:
      "Brown duck canvas workwear jacket. Hip length, full long sleeves, lined for warmth. Properly broken in. A few honest marks — this is workwear, not loungewear.",
    price: 7200,
    category: "men",
    condition: "used",
    brand: "Carhartt",
    size: "L",
    images: [card("Carhartt", "Detroit jacket · brown duck", "sand")],
    status: "active",
    createdAt: "2026-05-11T10:00:00Z",
    likes: 41,
    delivery: "ship",
  },
  {
    id: "l_012",
    sellerId: "u_maya",
    title: "Gold hoop earrings",
    description:
      "14k gold-filled, 30mm diameter. Hypoallergenic. Worn a handful of times, no tarnish.",
    price: 2400,
    category: "accessories",
    condition: "like_new",
    brand: "Mejuri",
    size: "One size",
    images: [img("1576995853123-5a10305d93c0")],
    status: "active",
    createdAt: "2026-05-17T15:45:00Z",
    likes: 22,
    delivery: "ship",
  },
  {
    id: "l_013",
    sellerId: "u_noa",
    title: "Pleated midi skirt · navy",
    description:
      "A-line pleated skirt, sits at natural waist, falls below the knee to mid-calf. Lined. Worn twice to events, perfectly pressed.",
    price: 5400,
    category: "women",
    condition: "like_new",
    brand: "Cos",
    size: "EU 38",
    images: [
      card("Cos", "Pleated midi skirt", "lavender"),
      card("Cos", "Navy · below the knee", "stone"),
    ],
    status: "active",
    createdAt: "2026-05-18T09:20:00Z",
    likes: 33,
    delivery: "both",
    pickupLocation: "Jerusalem, IL",
  },
  {
    id: "l_014",
    sellerId: "u_maya",
    title: "Pre-tied tichel · silk blend",
    description:
      "Beautiful taupe silk-blend pre-tied tichel with tie-back. Light, breathable, holds shape all day. Worn 3-4 times. Includes matching shapchik (volumizer).",
    price: 3200,
    category: "accessories",
    condition: "like_new",
    brand: "Wrapunzel",
    size: "One size",
    images: [
      card("Wrapunzel", "Pre-tied tichel · silk blend", "blush"),
      card("Wrapunzel", "Taupe · with shapchik", "sand"),
    ],
    status: "active",
    createdAt: "2026-05-17T11:00:00Z",
    likes: 47,
    delivery: "both",
    pickupLocation: "Brooklyn, NY",
  },
  {
    id: "l_015",
    sellerId: "u_noa",
    title: "Cotton button-down · long sleeve",
    description:
      "Crisp white cotton button-down, full long sleeves, classic collar. Buttons all the way up. Goes with everything, never not in style. Worn a handful of times.",
    price: 3800,
    category: "women",
    condition: "good",
    brand: "Uniqlo",
    size: "M",
    images: [card("Uniqlo", "Long-sleeve button-down · white", "stone")],
    status: "active",
    createdAt: "2026-05-16T08:00:00Z",
    likes: 28,
    delivery: "ship",
  },
];

const msg = (
  id: string,
  senderId: string,
  text: string,
  createdAt: string,
): Message => ({ id, senderId, text, createdAt });

export const conversations: Conversation[] = [
  {
    id: "c_001",
    participantId: "u_maya",
    listingId: "l_001",
    unread: true,
    messages: [
      msg("m1", "u_me", "Hey! Are these still available?", "2026-05-17T18:00:00Z"),
      msg("m2", "u_maya", "Yes they are! Let me know if you have questions.", "2026-05-17T18:14:00Z"),
      msg("m3", "u_me", "Would you take $35?", "2026-05-17T18:20:00Z"),
      msg("m4", "u_maya", "I can do $38, that's my best.", "2026-05-17T19:02:00Z"),
    ],
  },
  {
    id: "c_002",
    participantId: "u_dani",
    listingId: "l_002",
    unread: false,
    messages: [
      msg("m1", "u_me", "Do you ship to Israel?", "2026-05-16T11:00:00Z"),
      msg("m2", "u_dani", "Yes, shipping to IL is around $18 tracked.", "2026-05-16T12:30:00Z"),
      msg("m3", "u_me", "Perfect, going to buy now.", "2026-05-16T12:35:00Z"),
    ],
  },
  {
    id: "c_003",
    participantId: "u_noa",
    listingId: "l_003",
    unread: false,
    messages: [
      msg("m1", "u_me", "Is the tag still on?", "2026-05-16T15:00:00Z"),
      msg("m2", "u_noa", "Yes, never worn. I can send a photo of the tag if you want.", "2026-05-16T15:30:00Z"),
    ],
  },
];

export const orders: Order[] = [
  {
    id: "o_001",
    buyerId: "u_me",
    sellerId: "u_dani",
    listingId: "l_002",
    price: 7800,
    buyerFee: 390,
    sellerFee: 390,
    status: "shipped",
    trackingNumber: "RR123456789IL",
    createdAt: "2026-05-12T10:00:00Z",
  },
  {
    id: "o_002",
    buyerId: "u_me",
    sellerId: "u_noa",
    listingId: "l_003",
    price: 9500,
    buyerFee: 475,
    sellerFee: 475,
    status: "paid",
    createdAt: "2026-05-16T20:00:00Z",
  },
  {
    id: "o_003",
    buyerId: "u_me",
    sellerId: "u_maya",
    listingId: "l_008",
    price: 6800,
    buyerFee: 340,
    sellerFee: 340,
    status: "completed",
    trackingNumber: "RR987654321IL",
    createdAt: "2026-04-22T14:00:00Z",
  },
];

export function getUser(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getUserByUsername(username: string): User | undefined {
  return users.find((u) => u.username === username);
}

export function getListing(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export function listingsBySeller(sellerId: string): Listing[] {
  return listings.filter((l) => l.sellerId === sellerId);
}

export function getConversation(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}
