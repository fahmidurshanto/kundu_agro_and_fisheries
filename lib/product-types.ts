export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  unit: string;
  thumbnail: string;
  createdAt: string;
};

export const PRODUCT_CATEGORIES = [
  "Fisheries medicine / chemical",
  "Dairy medicine",
  "Human food",
  "Fish feed / raw materials",
  "Dairy feed / raw materials",
  "Import items",
] as const;

export const PRODUCT_UNITS = ["kg", "gram", "litre", "piece", "dozen", "pack"] as const;
