"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import useDataTable from "@/hooks/use-data-table";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useQueryStates } from "nuqs";
import { STOCK_LIST_FILTER_PARSERS } from "@/constants/inventory/stock-overview.constant";
import DialogProducts from "@/components/common/dialog/dialog-products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StockOverviewForm,
  stockOverviewFormSchema,
} from "@/validations/inventory/stock-overview.validation";
import { UnitProduct } from "@/types/products/product-dialog";
import CardStockOverview from "./card-stock-overview";
import { DataTable } from "@/components/common/tanstack-table";
import { StockMovement } from "@/types/inventory/stock-movement";
import { stockOverviewColumns } from "@/components/columns.tsx/stock-overview-columns";
import { formatDateLocal, parseRange } from "@/lib/format-date";

export default function StockOverview() {
  const [filters, setFilters] = useQueryStates(STOCK_LIST_FILTER_PARSERS);

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

  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((state) => state.currentBrandId);
  const { currentPage, handleChangePage } = useDataTable();

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

  const handleSearch = () => {
    const values = form.getValues();

    setFilters((prev) => ({
      ...prev,
      branchId: values.branch_id || null,
      locationId: values.branch_location_id || null,
      product_units_id: values.product_units_id || null,
      date: values.date || null,
    }));
  };

  const handleOpenProductPicker = () => {
    setActiveMapping({
      key: "product_units_id",
      products_id: "products_id",
      units_id: "product_units_id",
    });
    setOpenDialog(true);
  };
  const { from, to } = parseRange(filters.date ?? "") ?? {};

  const { data: stockMovementData, isLoading } = useQuery({
    queryKey: ["stock-movements", filters, currentPage],
    queryFn: async () => {
      const query = supabase
        .from("stock_movements")
        .select(
          "products!inner(name, upc), product_units(units(name)), branch_location(name), reference_type, qty_base, direction, reference_id, movement_date",
          {
            count: "exact",
          },
        )
        .eq("clients_id", currentId)
        .eq("product_units_id", filters.product_units_id)
        .eq("branch_location_id", filters.locationId)
        .gte(
          "movement_date",
          formatDateLocal(
            from ??
              new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          ),
        )
        .lte("movement_date", formatDateLocal(to ?? new Date()))
        .range((currentPage - 1) * 20, currentPage * 20 - 1)
        .eq("brand_id", currentBrandId);

      const result = await query.overrideTypes<StockMovement[]>();

      if (result.error) {
        toast.error("Get Movement Data Failed", {
          description: result.error.message,
        });
      }
      return {
        data: result.data ?? [],
        totalPages: Math.ceil((result.count ?? 0) / 10),
        totalData: result.count ?? 0,
      };
    },
    enabled: !!filters.product_units_id && !!currentId && !!currentBrandId,
  });
  return (
    <>
      <CardStockOverview
        form={form}
        selectedProduct={selectedProduct}
        filters={filters}
        onOpenProductPicker={handleOpenProductPicker}
        onSearch={handleSearch}
      />
      <DataTable
        data={stockMovementData?.data || []}
        columns={stockOverviewColumns(currentPage)}
        totalPages={stockMovementData?.totalPages || 0}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        tableHeader={false}
        isLoading={isLoading}
        totalData={stockMovementData?.totalData}
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
