export interface Property {
  id: string;
  title: string;
  description: string;
  price: number; // Store price in cents to avoid floating-point issues    type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  images: string[];
  is_featured: boolean;
  is_sold: boolean;
  created_at: string;
}
