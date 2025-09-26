// hooks/use-branches.ts
import { useQuery } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import { createClient } from "@/lib/supabase/client";

export function useBranches() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  return useQuery({
    queryKey: ["branches", currentBrandId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("branch")
        .select("*")
        .eq("status", true)
        .eq("brand_id", currentBrandId);

      if (error) throw error;
      return data;
    },
    enabled: !!currentBrandId, // only run when a brand is selected
  });
}
