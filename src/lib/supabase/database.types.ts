// Hand-written types matching supabase/schema.sql. Replace with
// `supabase gen types typescript --linked` output once the project is linked.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          bio: string;
          rating: number;
          review_count: number;
          location: string;
          payout_method: "bank" | "paypal" | null;
          payout_last4: string | null;
          payout_status: "none" | "verified";
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          bio?: string;
          rating?: number;
          review_count?: number;
          location?: string;
          payout_method?: "bank" | "paypal" | null;
          payout_last4?: string | null;
          payout_status?: "none" | "verified";
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      listings: {
        Row: {
          id: string;
          seller_id: string;
          title: string;
          description: string;
          price_cents: number;
          category: "women" | "men" | "kids" | "shoes" | "bags" | "accessories" | "home";
          condition: "new" | "like_new" | "good" | "used";
          brand: string;
          size: string;
          status: "active" | "sold";
          delivery: "ship" | "pickup" | "both";
          pickup_location: string | null;
          likes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          title: string;
          description: string;
          price_cents: number;
          category: Database["public"]["Tables"]["listings"]["Row"]["category"];
          condition: Database["public"]["Tables"]["listings"]["Row"]["condition"];
          brand?: string;
          size?: string;
          status?: "active" | "sold";
          delivery: "ship" | "pickup" | "both";
          pickup_location?: string | null;
          likes?: number;
        };
        Update: Partial<Database["public"]["Tables"]["listings"]["Insert"]>;
        Relationships: [];
      };
      listing_images: {
        Row: {
          id: string;
          listing_id: string;
          url: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          listing_id: string;
          url: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["listing_images"]["Insert"]>;
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          read_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
