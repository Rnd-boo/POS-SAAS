"use client";

import { getStockAdjustmentColumns } from "@/components/columns.tsx/stock-adjustment-columns";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { DataTable } from "@/components/common/tanstack-table";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { applyFilterQuery } from "@/hooks/use-filter-query";
import PageHeader from "@/components/common/page-header";
import { StockAdjustment } from "@/validations/inventory/stock-adjustment.validation";
import { useBrandStore } from "@/stores/brand-store";
import { usePathname, useRouter } from "next/navigation";

export default function StockAdjusmentManagement() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((state) => state.currentBrandId);
  const router = useRouter();
  const pathname = usePathname();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();

  const {
    data: stockAdjustmentData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "stock_adjustments",
      currentPage,
      currentSearch,
      currentId,
      currentBrandId,
      sorting,
      filters,
    ],
    queryFn: async () => {
      let query = supabase
        .from("stock_adjustments")
        .select(
          "id, stock_adjustment_date, branch_location_id, branch_location(name), branch_id, branch(name), notes, status",
          { count: "exact" },
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .range((currentPage - 1) * 10, currentPage * 10 - 1)
        .ilike("id", `%${currentSearch}%`);

      const sort = sorting[0];

      if (sort) {
        query.order(sort.id, { ascending: sort.desc ? false : true });
      } else {
        query.order("created_at", { ascending: false });
      }
      query = applyFilterQuery(query, filters);

      const result = await query;

      if (result.error)
        toast.error("Get Stock Adjustment Data Failed", {
          description: result.error.message,
        });
      return result;
    },
    enabled: !!currentId && !!currentBrandId,
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: StockAdjustment;
    type: "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const totalData = stockAdjustmentData?.count ?? 0;

  const totalPages = useMemo(() => {
    return stockAdjustmentData && stockAdjustmentData.count !== null
      ? Math.ceil(stockAdjustmentData.count / 10)
      : 0;
  }, [stockAdjustmentData]);

  const data: StockAdjustment[] = stockAdjustmentData?.data || [];
  const columns: ColumnDef<StockAdjustment>[] = useMemo(
    () =>
      getStockAdjustmentColumns({
        router,
        pathname,
        setSelectedAction,
      }),
    [pathname, router, setSelectedAction],
  );

  return (
    <div className="w-full">
      <PageHeader
        handleChangeSearch={handleChangeSearch}
        title="Stock Adjustment"
        placeholder="Stock Adjustment ID"
        filters={filters}
        setFilters={setFilters}
        setOpenDialogFilters={setOpenDialogFilters}
        pathname={pathname}
      />
      <DataTable
        data={data}
        columns={columns}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalData={totalData}
        sorting={sorting}
        onSortingChange={setSorting}
        refetch={refetch}
      />
      {/* <DialogFilters
        configs={StockAdjustment_TABLE_PRODUCT.map((config) => {
          if (config.key === "status") {
            return {
              ...config,
              options: STATUS_LIST,
            };
          }
          return config;
        })}
        onOpenChange={setOpenDialogFilters}
        open={openDialogFilters}
        onChange={setFilters}
      /> */}
    </div>
  );
}
