import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { STATUS_LIST } from "@/constants/general.constant";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export default function FormTableMap<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
}) {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);

  const { data: branch } = useQuery({
    queryKey: ["branch", currentId, currentBrandId],
    queryFn: async () => {
      const result = await supabase
        .from("branch")
        .select("id,name,status")
        .eq("status", true)
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId);

      if (result.error)
        toast.error("Get Branch Data Failed", {
          description: result.error.message,
        });

      return result?.data;
    },
    enabled: !!currentId,
  });

  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle>{type} Table Map</DialogTitle>
          <DialogDescription>
            {type === "Create"
              ? "Add a new Table Map"
              : "Make a changes this Table Map"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 ">
          <div className="space-y-4 max-h-[50vh] overflow-y-auto px-1">
            <FormInput
              form={form}
              name={"name" as Path<T>}
              label="Table Map"
              placeholder="Insert Table Map name"
            />
            <FormSelect
              form={form}
              name={"branch_id" as Path<T>}
              label="Branch"
              valueKey="id"
              labelKey="name"
              data={branch ?? undefined}
            />
            <FormSelect
              form={form}
              name={"status" as Path<T>}
              label="Status"
              selectItem={STATUS_LIST}
            />
            <FormInput
              form={form}
              name={"brand_id" as Path<T>}
              label=""
              className="hidden"
              placeholder=""
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isLoading ? <Loader2 className="animate-spin" /> : type}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
