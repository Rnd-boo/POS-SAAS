"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import useDataTable from "@/hooks/use-data-table";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useQueryStates } from "nuqs";
import { stockListFilterParsers } from "@/constants/inventory/stock-overview.constant";
import DialogProducts from "@/components/common/dialog/dialog-products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StockOverviewForm,
  stockOverviewFormSchema,
} from "@/validations/inventory/stock-overview.validation";
import { UnitProduct } from "@/types/products/product-dialog";
import CardStockOverview from "./card-stock-overview";

export default function StockOverview() {
  const [filters, setFilters] = useQueryStates(stockListFilterParsers);

  const [openDialog, setOpenDialog] = useState(false);
  const [activeMapping, setActiveMapping] = useState<Record<string, string>>(
    {},
  );
  const [selectedProduct, setSelectedProduct] = useState<
    Record<string, UnitProduct | null>
  >({});

  const form = useForm<StockOverviewForm>({
    resolver: zodResolver(stockOverviewFormSchema),
    defaultValues: {
      product_units_id: filters.product_units_id ?? "",
      branch_id: filters.branchId ?? "",
      branch_location_id: filters.locationId ?? "",
      date: filters.date ?? "",
    },
  });

  const watchedFormValues = form.watch([
    "branch_id",
    "branch_location_id",
    "product_units_id",
    "date",
  ]);

  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((state) => state.currentBrandId);
  const { data: defaultProduct } = useQuery({
    queryKey: ["stock-overview-default-product", filters.product_units_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_units")
        .select(
          "id, products_id, units_id, products!inner(name, upc, categories!inner(name)), units!inner(name)",
        )
        .eq("id", filters.product_units_id)
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .eq("products.status", true)
        .single();

      if (error) {
        toast.error("Get Product Data Failed", {
          description: error.message,
        });
        throw error;
      }

      const product = Array.isArray(data.products)
        ? data.products[0]
        : data.products;
      const categories = Array.isArray(product.categories)
        ? product.categories[0]
        : product.categories;
      const units = Array.isArray(data.units) ? data.units[0] : data.units;

      return {
        ...data,
        products: { ...product, categories },
        units,
      } as UnitProduct;
    },
    enabled: !!filters.product_units_id && !!currentId && !!currentBrandId,
  });

  useEffect(() => {
    if (defaultProduct && !selectedProduct.product_units_id) {
      setSelectedProduct({ product_units_id: defaultProduct });
    }
  }, [defaultProduct, selectedProduct]);

  useEffect(() => {
    const [branchId, branchLocationId, productUnitsId, date] =
      watchedFormValues;

    setFilters((prev) => ({
      ...prev,
      branchId: branchId || null,
      locationId: branchLocationId || null,
      product_units_id: productUnitsId || null,
      date: date || null,
    }));
  }, [watchedFormValues, setFilters]);

  const handleOpenProductPicker = () => {
    setActiveMapping({
      key: "product_units_id",
      products_id: "products_id",
      units_id: "product_units_id",
    });
    setOpenDialog(true);
  };

  return (
    <>
      <CardStockOverview
        form={form}
        selectedProduct={selectedProduct}
        filters={filters}
        onOpenProductPicker={handleOpenProductPicker}
      />

      <DialogProducts
        form={form}
        is_base_unit={true}
        mapping={activeMapping}
        setSelectedProduct={setSelectedProduct}
        open={openDialog}
        onOpenChange={setOpenDialog}
        branch_location_id={filters.locationId ?? ""}
      />
    </>
  );
}
