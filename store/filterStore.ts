import { create } from "zustand";

export type PropertyType =
  | "apartment"
  | "house"
  | "condo"
  | "studio"
  | "villa"
  | null;

interface FilterState {
  search: string;
  propertyType: PropertyType;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;

  setSearch: (search: string) => void;
  setPropertyType: (type: PropertyType) => void;
  setMinPrice: (price: number | null) => void;
  setMaxPrice: (price: number | null) => void;
  setBedrooms: (bedrooms: number | null) => void;
  setBathrooms: (bathrooms: number | null) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  propertyType: null,
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
  bathrooms: null,

  setSearch: (value) => set({ search: value }),
  setPropertyType: (value) => set({ propertyType: value }),
  setMinPrice: (value) => set({ minPrice: value }),
  setMaxPrice: (value) => set({ maxPrice: value }),
  setBedrooms: (value) => set({ bedrooms: value }),
  setBathrooms: (value) => set({ bathrooms: value }),

  resetFilters: () =>
    set({
      search: "",
      propertyType: null,
      minPrice: null,
      maxPrice: null,
      bedrooms: null,
      bathrooms: null,
    }),
}));
