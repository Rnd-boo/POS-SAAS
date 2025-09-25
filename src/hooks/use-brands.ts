import { useQuery } from "@tanstack/react-query";
import { Brand } from "@/types/brand";
import { createClient } from "@/lib/supabase/client";

export function useBrands(userId: string | null) {
  const supabase = createClient();
  return useQuery<Brand[]>({
    queryKey: ["brands", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("brand")
        .select("*")
        .eq("client_profiles_id", userId);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5, // optional: 5 min cache
  });
}
