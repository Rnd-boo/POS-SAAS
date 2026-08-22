"use client";

import { Combobox } from "@/components/common/form/manual-combobox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import { UseFormReturn } from "react-hook-form";
import FormSelect from "@/components/common/form/form-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/common/form/form-input";
import FormDatePicker from "@/components/common/form/form-date-picker";
import { FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useBranchLocationQuery } from "@/hooks/queries/use-branch-locations";
import { StockAdjustmentForm } from "@/validations/inventory/stock-adjustment.validation";
import FormSelectData from "@/components/common/form/form-select-data";
import FormProductionOrderBOM from "../../../production/orders/_components/form-production-order-bom";
import FormStockAdjustmentItems from "./form-stock-adjustment-items";

export default function CardFormStockAdjusment({
  form,
  isPending,
  isLoading,
  type,
  onSubmit,
  handleReject,
}: {
  form: UseFormReturn<StockAdjustmentForm>;
  isPending?: boolean;
  isLoading?: boolean;
  type: "Create" | "Detail" | "Update" | "Approve";
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  handleReject?: () => void;
}) {
  const { data: branches } = useBranchQuery();
  const branch_id = form.watch("branch_id");
  const { branchLocations } = useBranchLocationQuery({
    branch_id,
  });

  const router = useRouter();

  const status = form.getValues("status");

  const REASON_LIST = [
    {
      value: "stock opname",
      label: "Stock Opname",
    },
    {
      value: "damaged goods",
      label: "Damaged Goods",
    },
    {
      value: "lost",
      label: "Lost / Missing",
    },
    {
      value: "expired",
      label: "Expired",
    },
    {
      value: "correction",
      label: "Correction",
    },
    {
      value: "other",
      label: "Other",
    },
  ];

  return (
    <Form {...form}>
      <form className="w-full pb-28" onSubmit={onSubmit}>
        <div className={cn(type === "Detail" ? "flex gap-2" : "")}>
          <Card className={cn(type === "Detail" ? "w-3/4" : "w-full")}>
            <CardHeader>
              <CardTitle>
                {type === "Approve" ? "Create" : type} Stock Adjustment
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <FormDatePicker
                isLoading={isLoading}
                disabled={type === "Approve" || type === "Detail"}
                required
                form={form}
                label="Adjustment Date"
                name="stock_adjustment_date"
              />
              <FormSelect
                form={form}
                selectItem={REASON_LIST}
                name="reason"
                isLoading={isLoading}
                label="Reason"
                required
                disabled={type === "Approve" || type === "Detail"}
              />
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
                          disabled={type === "Approve" || type === "Detail"}
                          placeholder="Select Branch"
                          modal
                          items={
                            branches?.map((branch) => ({
                              label: branch.name,
                              value: String(branch.id),
                            })) || []
                          }
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormSelectData
                required
                isLoading={isLoading}
                form={form}
                name="branch_location_id"
                label="Location"
                data={branchLocations}
                disabled={!branch_id || type === "Detail" || type === "Approve"}
              />
            </CardContent>
          </Card>
          {type === "Detail" && (
            <Card className="w-1/4 h-fit">
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label>Status</Label>
                  {isLoading ? (
                    <Skeleton className="h-9 rounded-full w-[144px]" />
                  ) : (
                    <div
                      className={cn(
                        "px-2 py-1 rounded-full text-white w-fit capitalize text-sm",
                        status === "new"
                          ? "bg-green-600"
                          : status === "rejected"
                            ? "bg-destructive"
                            : "bg-blue-600",
                      )}
                    >
                      {status}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <Card className="my-2">
          <CardHeader>
            <CardTitle>Stock Adjusment Items</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <FormStockAdjustmentItems
              form={form}
              type={type}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
        <Card className="my-2">
          <CardContent className="w-full">
            <FormInput
              isLoading={isLoading}
              form={form}
              label="Notes"
              name="notes"
              type="textarea"
              disabled={type === "Approve" || type === "Detail"}
            />
          </CardContent>
        </Card>
        <div className="fixed bottom-0 right-0 w-full flex justify-end gap-x-2 p-4 bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.6)]">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {type === "Detail" ? "Back" : "Cancel"}
          </Button>
          {type === "Approve" && (
            <Button type="button" variant="destructive" onClick={handleReject}>
              {isPending ? <Loader2 className="animate-spin" /> : "Reject"}
            </Button>
          )}
          {type !== "Detail" && (
            <Button type="submit">
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : type === "Approve" ? (
                "Approve"
              ) : (
                type
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
