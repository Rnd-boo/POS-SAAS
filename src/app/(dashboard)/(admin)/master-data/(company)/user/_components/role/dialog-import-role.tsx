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
import { RolesForm } from "@/validations/user/role.validation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export default function DialogImportRole({
  form,
  open,
  setOpen,
}: {
  form: UseFormReturn<RolesForm>;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);
  const supabase = createClient();
  const [selectedRoleId, setSelectedRoleId] = useState("");

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
    staleTime: 1000 * 60 * 5,
  });

  const handleApply = async () => {
    if (!selectedRoleId) {
      toast.warning("Please select a role first");
      return;
    }

    const result = await supabase
      .from("role_permissions")
      .select("permission_id")
      .eq("clients_id", currentId)
      .eq("brand_id", currentBrandId)
      .eq("role_id", selectedRoleId);

    if (result.error) {
      toast.error("Get User Role Data Failed", {
        description: result.error.message,
      });
      return;
    }

    const permissionItems = (result.data ?? []).map((item) => ({
      permission_id: item.permission_id,
    }));

    form.setValue("role_permissions", permissionItems);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Select Existing Role</DialogTitle>
        </DialogHeader>
        <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
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
            type="button"
            className="cursor-pointer"
            onClick={handleApply}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
