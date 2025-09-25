"use client";
import { useBrands } from "@/hooks/use-brands";
import { useBrandStore } from "@/stores/brand-store";
import { ReactNode, useEffect } from "react";

export default function BrandStoreProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId: string | null;
}) {
  const { data: brands, isLoading } = useBrands(userId);
  const { setBrands, setCurrentBrand, currentBrandId } = useBrandStore();

  useEffect(() => {
    if (userId && brands && brands.length > 0) {
      setBrands(brands);

      if (!currentBrandId) {
        setCurrentBrand(String(brands[0]?.id));
      }
    } else if (!userId) {
      setBrands([]);
      setCurrentBrand("");
    }
  }, [userId, brands, setBrands, setCurrentBrand, currentBrandId]);

  // Show loading only for initial load, not for every refetch
  if (isLoading && !brands) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading brands...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
