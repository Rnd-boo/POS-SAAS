// hooks/use-branches.ts
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

export function useProductStockQuery({
  branch_location_id,
  productIds,
}: {
  branch_location_id: string;
  productIds?: string[];
}) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);

  const {
    data: productStock,
    isLoading: isLoadingProductStock,
    refetch: refetchProductStock,
  } = useQuery({
    queryKey: ["product_stocks", branch_location_id, productIds],

    queryFn: async () => {
      const q = supabase.from("product_stocks");
      let builder = q.select(`id, products_id, on_hand`, { count: "exact" });
      builder = builder
        .eq("clients_id", currentId)
        .eq("branch_location_id", branch_location_id);
      if (productIds && productIds.length > 0) {
        builder = builder.in("products_id", productIds as unknown as any[]);
      }

      const result = await builder;
      if (result.error)
        toast.error("Get Product Stock Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled:
      !!currentId &&
      !!branch_location_id &&
      Array.isArray(productIds) &&
      productIds.length > 0,
  });

  return { productStock, isLoadingProductStock, refetchProductStock };
}
