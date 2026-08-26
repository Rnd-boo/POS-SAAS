"use client";

import CardStockList from "./card-stock-list";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import useDataTable from "@/hooks/use-data-table";
import { toast } from "sonner";
import { useState } from "react";

export type ProductFilters = {
  locationId: string;
  categoryId: string;
  upc: string;
  productName: string;
};
const initialFilters: ProductFilters = {
  locationId: "",
  categoryId: "",
  upc: "",
  productName: "",
};

export type ProductStock = {
  id: number;
  on_hand: number;
  branch_location: {
    name: string;
  };
  products: {
    name: string;
    upc: string;
    status: boolean;
    categories: {
      name: string;
    };
  };
};

export default function StockList() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((state) => state.currentBrandId);

  const [filterInput, setFilterInput] =
    useState<ProductFilters>(initialFilters);

  const [filters, setFilters] = useState<ProductFilters | null>(null);
  const [locationError, setLocationError] = useState("");
  const handleSearch = () => {
    if (!filterInput.locationId) {
      setLocationError("Location is required");
      return;
    }
    setLocationError("");
    setFilters(filterInput);
  };
  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();

  const { data: productStocks, isLoading } = useQuery({
    queryKey: [
      "product_stocks",
      currentPage,
      currentSearch,
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
            categories(name)  
          )
          `,
          {
            count: "exact",
          },
        )
        .eq("clients_id", currentId)
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
