"use client";

import FormDatePicker from "@/components/common/form/form-date-picker";
import FormSelectData from "@/components/common/form/form-select-data";
import { Combobox } from "@/components/common/form/manual-combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { OpenManufacturingForm } from "@/validations/production/open-manufacturing.validation";
import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export default function FormOpenManufacturingInformation({
  form,
  type,
  isLoading,
}: {
  form: UseFormReturn<OpenManufacturingForm>;
  type: "Create" | "Update" | "Detail";
  isLoading?: boolean;
}) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const { data: branches } = useBranchQuery();

  const branchId = form.watch("branch_id");
  const { data: branchLocations, isLoading: isLoadingBranchLocation } =
    useQuery({
      queryKey: ["branch_location", branchId],
      queryFn: async () => {
        const result = await supabase
          .from("branch_location")
          .select(`id,name`)
          .eq("clients_id", currentId)
          .eq("branch_id", branchId);

        if (result.error)
          toast.error("Get Location Data Failed", {
            description: result.error.message,
          });

        return result.data;
      },
      enabled: !!currentId && !!branchId && branchId !== "undefined",
    });

  return (
    <div className="grid grid-cols-[2fr_2fr_2fr_2fr] gap-4">
      <FormField
        control={form.control}
        name="branch_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Branch <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              {isLoading ? (
                <Skeleton className="h-9" />
              ) : (
                <Combobox
                  disabled={type === "Detail"}
                  placeholder="Select Branch"
                  modal
                  items={
                    branches?.map((branch) => ({
                      label: branch.name,
                      value: String(branch.id),
                    })) || []
                  }
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    form.setValue("origin_branch_location_id", "");
                    form.setValue("destination_branch_location_id", "");
                    form.setValue("qty", "");
                  }}
                />
              )}
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormDatePicker
        isLoading={isLoading}
        disabled={type === "Detail"}
        required
        form={form}
        label="Open Manufacturing Date"
        name="open_manufacturing_date"
      />
      <FormSelectData
        isLoading={isLoadingBranchLocation || isLoading}
        form={form}
        name="origin_branch_location_id"
        data={branchLocations || []}
        label="Origin Location"
        required
        disabled={type === "Detail"}
      />
      <FormSelectData
        isLoading={isLoadingBranchLocation || isLoading}
        form={form}
        name="destination_branch_location_id"
        data={branchLocations || []}
        label="Destination Loaction"
        required
        disabled={type === "Detail"}
      />
    </div>
  );
}
