import { Brand } from "@/types/brand";
import { create } from "zustand";

type BrandState = {
  brands: Brand[];
  currentBrandId: string | null;
  setBrands: (brands: Brand[]) => void;
  setCurrentBrand: (brandId: string) => void;
};

export const useBrandStore = create<BrandState>()((set) => ({
  brands: [],
  currentBrandId: null,
  setBrands: (brands) => set({ brands }),
  setCurrentBrand: (brandId) => set({ currentBrandId: brandId }),
}));
