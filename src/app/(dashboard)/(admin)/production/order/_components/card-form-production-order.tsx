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

export default function CardFormProductionOrder({
  form,
  isPending,
  type,
  onSubmit,
}: {
  form: UseFormReturn<ProductionOrderForm>;
  isPending?: boolean;
  type: "Create" | "Detail" | "Update";
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const { data: branches } = useBranchQuery();

  const TYPE_LIST = [
    { value: "assembly", label: "Assembly" },
    { value: "disassembly", label: "Disassembly" },
  ];
  const router = useRouter();
  return (
    <Form {...form}>
      <form className="w-full pb-28" onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{type} Production Order</CardTitle>
            <CardDescription>
              {type} Production Order information as needed.
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
                    <Combobox
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
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormDatePicker
              required
              form={form}
              label="Production Order Date"
              name="production_order_date"
            />
            <FormSelect
              form={form}
              name="type"
              selectItem={TYPE_LIST}
              label="Type"
              disabled
            />
          </CardContent>
        </Card>
        <Card className="my-2">
          <CardHeader>
            <CardTitle>Bill Of Materials</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <FormProductionOrderBOM form={form} type={type} />
          </CardContent>
        </Card>
        <Card className="my-2">
          <CardContent className="w-full">
            <FormInput form={form} label="Notes" name="notes" type="textarea" />
          </CardContent>
        </Card>
        <div className="fixed bottom-0 right-0 w-full flex justify-end gap-x-2 p-4 bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.6)]">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          {type !== "Detail" && (
            <Button type="submit">
              {isPending ? <Loader2 className="animate-spin" /> : type}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
