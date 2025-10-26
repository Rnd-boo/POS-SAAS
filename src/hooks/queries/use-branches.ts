// hooks/use-branches.ts
import { useQuery } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

export function useBranchQuery() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);

  return useQuery({
    queryKey: ["branches", currentBrandId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("branch")
        .select("id, name, status")
        .eq("status", true)
        .eq("brand_id", currentBrandId)
        .eq("clients_id", currentId);

      if (error) {
        toast.error("Get Branch Data Failed", {
          description: error.message,
        });
        throw error;
      }
      return data;
    },
    enabled: !!currentId && !!currentBrandId,
  });
}
