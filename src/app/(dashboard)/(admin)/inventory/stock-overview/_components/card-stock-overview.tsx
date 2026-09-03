"use client";

import { Search } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormCombobox from "@/components/common/form/form-combobox";
import FormDateRangePicker from "@/components/common/form/form-date-range-picker";
import FormSelectData from "@/components/common/form/form-select-data";
import { StockOverviewForm } from "@/validations/inventory/stock-overview.validation";
import { UnitProduct } from "@/types/products/product-dialog";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import { useBranchLocationQuery } from "@/hooks/queries/use-branch-locations";

type CardStockOverviewProps = {
  form: UseFormReturn<StockOverviewForm>;
  selectedProduct: Record<string, UnitProduct | null>;
  filters: {
    product_units_id?: string | null;
    branchId?: string | null;
    locationId?: string | null;
    date?: string | null;
  };
  branches?: Array<{ id: string; name: string }>;
  branchLocations?: Array<{ id: string; name: string }>;
  onOpenProductPicker: () => void;
};

export default function CardStockOverview({
  form,
  selectedProduct,
  filters,
  onOpenProductPicker,
}: CardStockOverviewProps) {
  const { data: branches } = useBranchQuery();
  const { branchLocations } = useBranchLocationQuery({
    branch_id: filters.branchId ?? "",
  });
  return (
    <Card className="w-full">
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <CardHeader className="text-2xl font-semibold">
            Stock Overview
          </CardHeader>
          <CardContent className="grid grid-cols-[4fr_3fr_3fr_2fr_5fr_3fr_3fr_3fr] gap-4 items-end">
            <FormField
              control={form.control}
              name="product_units_id"
              render={() => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <FormControl>
                    <Input
                      value={
                        selectedProduct?.product_units_id?.products?.name ??
                        filters.product_units_id ??
                        ""
                      }
                      placeholder="Click for searching products"
                      readOnly
                      onClick={onOpenProductPicker}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <Label>Product Code</Label>
              <Input
                disabled
                value={selectedProduct?.product_units_id?.products?.upc ?? ""}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Input
                disabled
                value={
                  selectedProduct?.product_units_id?.products?.categories
                    ?.name ?? ""
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Unit</Label>
              <Input
                disabled
                value={selectedProduct?.product_units_id?.units?.name ?? ""}
              />
            </div>

            <FormDateRangePicker
              form={form}
              label="Date"
              name="date"
              required
            />

            <FormCombobox
              form={form}
              items={branches || []}
              label="Branch"
              name="branch_id"
            />

            <FormSelectData
              form={form}
              name="branch_location_id"
              data={branchLocations}
              label="Location"
              required
            />

            <Button type="submit" className="w-full">
              <Search />
              Search
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
