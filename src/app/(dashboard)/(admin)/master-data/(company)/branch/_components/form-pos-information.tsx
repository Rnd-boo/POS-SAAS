import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import FormSelectData from "@/components/common/form-select-data";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { STATUS_LIST } from "@/constants/general.constant";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import {
  BranchForm,
  BranchOrderContext,
} from "@/validations/branch.validation";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { FormEvent, Fragment, useMemo } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export default function FormPOSInformation({
  form,
  type,
}: {
  form: UseFormReturn<BranchForm>;
  type: "Detail" | "Create" | "Update";
}) {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "branch_order_context",
  });
  const { data: orderContexts, isLoading } = useQuery({
    queryKey: ["order-context", currentBrandId, currentId],
    queryFn: async () => {
      const result = await supabase
        .from("order_context")
        .select("id,name,tax_value,tax_name,other_tax_value,other_tax_name")
        .eq("status", true)
        .eq("brand_id", currentBrandId)
        .eq("clients_id", currentId);

      if (result.error)
        toast.error("Get Order Contexts Data Failed", {
          description: result.error.message,
        });
      return result.data;
    },
  });
  const handleAddBranchOrderContext = () => {
    append({
      branch_id: "",
      order_context: "",
    });
  };
  return (
    <>
      <div
        className={cn(
          "grid gap-x-2 ",
          type === "Detail"
            ? "grid-cols-[2fr_1fr_1fr_1fr_1fr]"
            : "grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]"
        )}
      >
        <Label>Order Context</Label>
        <Label>Tax Name</Label>
        <Label>Tax Value</Label>
        <Label>Other Tax Name</Label>
        <Label>Other Tax Value</Label>
        {type !== "Detail" && <div></div>}
        {fields.map((field: BranchOrderContext, index: number) => {
          const selectedId = form.watch(
            `branch_order_context.${index}.order_context`
          );
          const selectedOrderContext = orderContexts?.find(
            (c) => c.id.toString() === selectedId
          );

          const filteredOrderContext = orderContexts?.filter((context) => {
            const selected = form
              .watch("branch_order_context")
              ?.map((row) => row.order_context)
              .filter((id, i) => i !== index);
            return !selected?.includes(context.id.toString());
          });
          return (
            <Fragment key={field.id}>
              <FormSelectData
                form={form}
                name={`branch_order_context.${index}.order_context`}
                label=""
                data={filteredOrderContext ?? []}
                disabled={type === "Detail"}
              />
              <Input
                value={selectedOrderContext?.tax_name ?? "-"}
                disabled
                name={"tax_name"}
                className="mt-2"
              />
              <Input
                value={selectedOrderContext?.tax_value ?? "-"}
                disabled
                name={"tax_value"}
                className="mt-2"
              />
              <Input
                value={selectedOrderContext?.other_tax_name ?? "-"}
                disabled
                name={"other_tax_name"}
                className="mt-2"
              />
              <Input
                value={selectedOrderContext?.other_tax_value ?? "-"}
                disabled
                name={"other_tax_value"}
                className="mt-2"
              />
              {type !== "Detail" && fields.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => remove(index)}
                  className="cursor-pointer mt-2"
                >
                  <X />
                </Button>
              )}
            </Fragment>
          );
        })}
      </div>
      {type !== "Detail" && (
        <Button
          type="button"
          onClick={handleAddBranchOrderContext}
          className="col-start-1 mt-2"
          variant="outline"
        >
          <Plus />
          Add Location
        </Button>
      )}
    </>
  );
}
