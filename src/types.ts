export const CATEGORIES = ["Clothes", "Books", "Food", "Furniture", "Electronics", "Other"] as const;
export const CONDITIONS = ["New", "Like new", "Good", "Fair"] as const;

export interface Item {
  id: string;
  owner_id: string;
  owner_name: string | null;
  title: string;
  description: string | null;
  category: string;
  condition: string;
  location: string | null;
  image_url: string | null;
  status: "available" | "claimed";
  claimed_by: string | null;
  created_at: string;
}
