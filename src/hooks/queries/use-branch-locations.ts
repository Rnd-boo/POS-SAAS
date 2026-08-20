import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

export function useBranchLocationQuery({ branch_id }: { branch_id?: string }) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);

  const {
    data: branchLocations,
    isLoading: isLoadingBranchLocation,
    refetch: refetchBranchLocation,
  } = useQuery({
    queryKey: ["branch_location", branch_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("branch_location")
        .select("id, name")
        .eq("branch_id", branch_id)
        .eq("clients_id", currentId);

      if (error) {
        toast.error("Get Location Data Failed", {
          description: error.message,
        });
        throw error;
      }
      return data;
    },
    enabled: !!currentId && !!branch_id && branch_id !== "undefined",
  });
  return { branchLocations, isLoadingBranchLocation, refetchBranchLocation };
}
