export type Condition = "new" | "like_new" | "good" | "used";

export type Category =
  | "women"
  | "men"
  | "kids"
  | "shoes"
  | "bags"
  | "accessories"
  | "home";

export type User = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  rating: number;
  reviewCount: number;
  joinedAt: string;
  location: string;
};

export type Listing = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
  brand: string;
  size: string;
  images: string[];
  status: "active" | "sold";
  createdAt: string;
  likes: number;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  participantId: string;
  listingId: string;
  messages: Message[];
  unread: boolean;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "completed";

export type Order = {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  price: number;
  buyerFee: number;
  sellerFee: number;
  status: OrderStatus;
  trackingNumber?: string;
  createdAt: string;
};
