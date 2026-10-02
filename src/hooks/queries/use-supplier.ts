// hooks/use-branches.ts
import { useQuery } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { getSupplierPICDetail } from "@/actions/supplier-action";

export function useSupplierQuery() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);

  return useQuery({
    queryKey: ["suppliers", currentBrandId, currentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("id, name, credit_terms")
        .eq("status", true)
        .eq("brand_id", currentBrandId)
        .eq("clients_id", currentId);

      if (error) {
        toast.error("Get Supplier Data Failed", {
          description: error.message,
        });
        throw error;
      }
      return data;
    },
    enabled: !!currentId && !!currentBrandId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSupplierDetail(id?: string) {
  return useQuery({
    queryKey: ["supplier_PIC", id],
    queryFn: () => getSupplierPICDetail(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
