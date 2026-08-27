import { useQuery } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";

export default function useCategoriesQuery(enabled = true) {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories", currentId],
    queryFn: async () => {
      const result = await supabase
        .from("categories")
        .select("id, name")
        .eq("status", true)
        .eq("clients_id", currentId);
      return result?.data;
    },
    enabled: !!currentId && enabled,
  });
  return { categoriesData, isLoadingCategories };
}
