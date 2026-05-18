import type {
  Conversation,
  Listing,
  Message,
  Order,
  User,
} from "./types";

const img = (id: string, w = 800, h = 1000) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

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
    location: "Tel Aviv, IL",
  },
  {
    id: "u_maya",
    username: "maya.thrift",
    displayName: "Maya",
    avatarUrl: avatar("maya"),
    bio: "Vintage finds & designer steals. Ships same day.",
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
    bio: "Selling pieces I never wore. All authentic.",
    rating: 4.8,
    reviewCount: 87,
    joinedAt: "2024-01-19",
    location: "Berlin, DE",
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
    title: "Vintage Levi's 501 jeans",
    description:
      "Classic high-rise 501s in dark wash. Bought in 2019, worn maybe 10 times. Hemmed to 28\" inseam. No stains, no rips — just the perfect amount of fade on the front.",
    price: 4200,
    category: "women",
    condition: "good",
    brand: "Levi's",
    size: "W27",
    images: [
      img("1542272604-787c3835535d"),
      img("1576995853123-5a10305d93c0"),
    ],
    status: "active",
    createdAt: "2026-05-14T10:12:00Z",
    likes: 38,
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
  },
  {
    id: "l_003",
    sellerId: "u_noa",
    title: "Acne Studios wool sweater",
    description:
      "Cream merino wool, oversized fit. Tag still attached — was a gift in wrong size. Original price €280.",
    price: 9500,
    category: "women",
    condition: "new",
    brand: "Acne Studios",
    size: "M",
    images: [
      img("1594223274512-ad4803739b7c"),
      img("1620799140408-edc6dcb6d633"),
    ],
    status: "active",
    createdAt: "2026-05-16T14:45:00Z",
    likes: 51,
  },
  {
    id: "l_004",
    sellerId: "u_maya",
    title: "Black leather biker jacket",
    description:
      "Real lambskin, asymmetric zip. Light wear on sleeves which gives it that lived-in look. Fits true to size.",
    price: 12000,
    category: "women",
    condition: "good",
    brand: "AllSaints",
    size: "S",
    images: [
      img("1551028719-00167b16eac5"),
      img("1591047139829-d91aecb6caea"),
    ],
    status: "active",
    createdAt: "2026-05-10T17:20:00Z",
    likes: 124,
  },
  {
    id: "l_005",
    sellerId: "u_rina",
    title: "Kids' raincoat 4-5 yrs",
    description:
      "Bright yellow, fully waterproof, hooded. Outgrown after one season. Smoke-free, pet-free home.",
    price: 1800,
    category: "kids",
    condition: "like_new",
    brand: "Polarn O. Pyret",
    size: "4-5Y",
    images: [img("1503342217505-b0a15ec3261c")],
    status: "active",
    createdAt: "2026-05-17T09:00:00Z",
    likes: 9,
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
  },
  {
    id: "l_008",
    sellerId: "u_maya",
    title: "Silk slip dress, midi length",
    description:
      "100% silk, bias cut. Champagne color. Wore to one wedding. Dry cleaned, ready to ship.",
    price: 6800,
    category: "women",
    condition: "like_new",
    brand: "Reformation",
    size: "S",
    images: [img("1604644401890-0bd678c83788")],
    status: "active",
    createdAt: "2026-05-12T16:00:00Z",
    likes: 88,
  },
  {
    id: "l_009",
    sellerId: "u_noa",
    title: "Wool overcoat, camel",
    description:
      "70% wool, 30% cashmere. Bought last winter, decided it wasn't my color. Beautifully tailored, deep pockets.",
    price: 14500,
    category: "women",
    condition: "like_new",
    brand: "Massimo Dutti",
    size: "M",
    images: [img("1434389677669-e08b4cac3105")],
    status: "active",
    createdAt: "2026-05-09T13:00:00Z",
    likes: 156,
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
    images: [img("1525507119028-ed4c629a60a3")],
    status: "active",
    createdAt: "2026-05-15T07:15:00Z",
    likes: 4,
  },
  {
    id: "l_011",
    sellerId: "u_dani",
    title: "Vintage Carhartt work jacket",
    description:
      "Detroit jacket, brown duck canvas. Properly broken in. A few honest marks — this is workwear, not loungewear.",
    price: 7200,
    category: "men",
    condition: "used",
    brand: "Carhartt",
    size: "L",
    images: [img("1591047139829-d91aecb6caea")],
    status: "active",
    createdAt: "2026-05-11T10:00:00Z",
    likes: 41,
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
