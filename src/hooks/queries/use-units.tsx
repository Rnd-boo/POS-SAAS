import { useQuery } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";

export default function useUnitsQuery(enabled = true) {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);

  const { data: unitsData, isLoading: isLoadingUnits } = useQuery({
    queryKey: ["units", currentId, currentBrandId],
    queryFn: async () => {
      const result = await supabase
        .from("units")
        .select("id, name")
        .eq("status", true)
        .eq("brand_id", currentBrandId)
        .eq("clients_id", currentId);
      return result?.data;
    },
    enabled: !!currentId && enabled && !!currentBrandId,
    staleTime: 5 * 60 * 1000,
  });
  return { unitsData, isLoadingUnits };
}
