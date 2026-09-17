"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import useDataTable from "@/hooks/use-data-table";
import { toast } from "sonner";
import { useEffect, useState } from "react";
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
import { stockOverviewColumns } from "@/components/columns.tsx/stock-overview-columns";
import { formatDateLocal, parseRange } from "@/lib/format-date";
import { useStockCardQuery } from "@/hooks/queries/use-stock-card";
import { TableCell, TableRow } from "@/components/ui/table";

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
    if (!values.branch_location_id && !values.date) {
      toast.error("Please select at least one filter to search.");
      return;
    }
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

  const { data: stockCardData, isLoading } = useStockCardQuery(
    filters.product_units_id ?? "",
    filters.locationId ?? "",
    formatDateLocal(from),
    formatDateLocal(to),
    currentPage,
  );

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
        data={stockCardData?.rows || []}
        columns={stockOverviewColumns(currentPage)}
        totalPages={Math.ceil((stockCardData?.totalData || 0) / 20)}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        tableHeader={false}
        isLoading={isLoading}
        footer={
          <TableRow>
            <TableCell colSpan={7} />
            <TableCell className="font-semibold text-center ">Total</TableCell>
            <TableCell className="font-semibold">
              {stockCardData?.totalIn ?? 0}
            </TableCell>
            <TableCell className="font-semibold">
              {stockCardData?.totalOut ?? 0}
            </TableCell>
            <TableCell className="font-semibold">
              {stockCardData?.endingBalance ?? 0}
            </TableCell>
          </TableRow>
        }
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
