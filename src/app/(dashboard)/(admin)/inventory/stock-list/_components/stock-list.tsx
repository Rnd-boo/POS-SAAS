"use client";

import CardStockList from "./card-stock-list";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import useDataTable from "@/hooks/use-data-table";
import { toast } from "sonner";
import { useState } from "react";
import { ProductStock } from "@/types/inventory/stock-list";
import {
  INITIAL_STOCK_LIST_FILTER,
  STOCK_LIST_FILTERS,
} from "@/constants/inventory/stock-list.constant";

export default function StockList() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((state) => state.currentBrandId);

  const [filterInput, setFilterInput] = useState<STOCK_LIST_FILTERS>(
    INITIAL_STOCK_LIST_FILTER,
  );

  const [filters, setFilters] = useState<STOCK_LIST_FILTERS | null>(null);
  const [locationError, setLocationError] = useState("");
  const handleSearch = () => {
    if (!filterInput.locationId) {
      setLocationError("Location is required");
      return;
    }
    setLocationError("");
    setFilters(filterInput);
    handleChangePage(1);
    refetch();
  };
  const { currentPage, handleChangePage } = useDataTable();

  const {
    data: productStocks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "product_stocks",
      currentPage,
      currentId,
      currentBrandId,
      filters,
    ],
    queryFn: async () => {
      let query = supabase
        .from("product_stocks")
        .select(
          `
          on_hand,
          branch_location(name),
          products!inner(id,name,upc,status,
            categories(name),
            product_units!inner (
            id,
            units (
              id,
              name
              )
            )  
          )
          `,
          {
            count: "exact",
          },
        )
        .eq("clients_id", currentId)
        .eq("products.product_units.is_base_unit", true)
        .range((currentPage - 1) * 10, currentPage * 10 - 1);

      if (filters?.locationId)
        query = query.eq("branch_location_id", filters?.locationId);
      if (filters?.categoryId)
        query = query.eq("products.categories_id", filters?.categoryId);
      if (filters?.upc)
        query = query.ilike("products.upc", `%${filters?.upc}%`);
      if (filters?.productName)
        query = query.ilike("products.name", `%${filters?.productName}%`);

      const result = await query.overrideTypes<ProductStock[]>();
      if (result.error)
        toast.error("Get Stock Adjustment Data Failed", {
          description: result.error.message,
        });
      return {
        data: result.data ?? [],
        totalPages: Math.ceil((result.count ?? 0) / 10),
        totalData: result.count ?? 0,
      };
    },
    enabled: !!currentId && !!currentBrandId && !!filters,
  });

  return (
    <CardStockList
      totalData={productStocks?.totalData}
      isLoading={isLoading}
      filters={filterInput}
      onChange={setFilterInput}
      onSearch={handleSearch}
      handleChangePage={handleChangePage}
      currentPage={currentPage}
      locationError={locationError}
      setLocationError={setLocationError}
      data={productStocks?.data || []}
      totalPages={productStocks?.totalPages || 0}
    />
  );
}
