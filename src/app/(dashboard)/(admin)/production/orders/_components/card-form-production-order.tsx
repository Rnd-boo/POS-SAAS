"use client";

import DateRangeInput from "@/components/common/date-range-picker";
import { Combobox } from "@/components/common/manual-combobox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import { UseFormReturn } from "react-hook-form";
import { ProductionOrderForm } from "@/validations/production/production-order.validation";
import FormSelect from "@/components/common/form-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormProductionOrderBOM from "./form-production-order-bom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/common/form-input";
import FormDatePicker from "@/components/common/form-date-picker";
import { FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function CardFormProductionOrder({
  form,
  isPending,
  isLoading,
  type,
  onSubmit,
  handleReject,
}: {
  form: UseFormReturn<ProductionOrderForm>;
  isPending?: boolean;
  isLoading?: boolean;
  type: "Create" | "Detail" | "Update" | "Authorize";
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  handleReject?: () => void;
}) {
  const { data: branches } = useBranchQuery();

  const TYPE_LIST = [
    { value: "assembly", label: "Assembly" },
    { value: "disassembly", label: "Disassembly" },
  ];
  const router = useRouter();

  const status = form.watch("status");

  return (
    <Form {...form}>
      <form className="w-full pb-28" onSubmit={onSubmit}>
        <div className={cn(type === "Detail" ? "flex gap-2" : "")}>
          <Card className={cn(type === "Detail" ? "w-3/4" : "w-full")}>
            <CardHeader>
              <CardTitle>
                {type === "Authorize" ? "Create" : type} Production Order
              </CardTitle>
              <CardDescription>
                {type === "Authorize" ? "Confirm" : type} Production Order
                information as needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-[2fr_2fr_1fr] gap-4">
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
                          disabled={type === "Authorize" || type === "Detail"}
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
              <FormDatePicker
                isLoading={isLoading}
                disabled={type === "Authorize" || type === "Detail"}
                required
                form={form}
                label="Production Order Date"
                name="production_order_date"
              />
              <FormSelect
                isLoading={isLoading}
                form={form}
                name="type"
                selectItem={TYPE_LIST}
                label="Type"
                disabled
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
            <CardTitle>Bill Of Materials</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <FormProductionOrderBOM
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
              disabled={type === "Authorize" || type === "Detail"}
            />
          </CardContent>
        </Card>
        <div className="fixed bottom-0 right-0 w-full flex justify-end gap-x-2 p-4 bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.6)]">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {type === "Detail" ? "Back" : "Cancel"}
          </Button>
          {type === "Authorize" && (
            <Button type="button" variant="destructive" onClick={handleReject}>
              {isPending ? <Loader2 className="animate-spin" /> : "Reject"}
            </Button>
          )}
          {type !== "Detail" && (
            <Button type="submit">
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : type === "Authorize" ? (
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
