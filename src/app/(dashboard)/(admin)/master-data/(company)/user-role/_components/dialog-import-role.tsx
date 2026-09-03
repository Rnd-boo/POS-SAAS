import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function DialogImportRole({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);
  const supabase = createClient();

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles", currentId, currentBrandId],
    queryFn: async () => {
      const result = await supabase
        .from("roles")
        .select("name,id")
        .eq("brand_id", currentBrandId)
        .eq("status", true)
        .eq("clients_id", currentId);

      if (result.error)
        toast.error("Get Stock Adjustment Data Failed", {
          description: result.error.message,
        });
      return result.data ?? [];
    },
    enabled: !!currentId && !!currentBrandId && open === true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Select Existing Role</DialogTitle>
        </DialogHeader>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={isLoading ? "Loading..." : "Select a role"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Role</SelectLabel>
              {roles?.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="cursor-pointer"
            onClick={() => {
              //   onChange?.(values);
              setOpen(false);
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
