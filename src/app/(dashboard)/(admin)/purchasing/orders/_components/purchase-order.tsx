"use client";

import { purchaseOrderColumns } from "@/components/columns.tsx/purchase-order-columns";
import DialogFilters from "@/components/common/dialog/dialog-filters";
import PageHeader from "@/components/common/page-header";
import { DataTable } from "@/components/common/tanstack-table";
import useDataTable from "@/hooks/use-data-table";
import { applyFilterQuery } from "@/hooks/use-filter-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { PurchaseOrderData } from "@/types/purchasing/purchase-order";
import type { PurchaseOrder } from "@/validations/purchasing/purchase-order.validation";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function PurchaseOrder() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((state) => state.currentBrandId);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();
  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();

  const {
    data: purchaseOrders,
    isLoading: isLoadingPurchaseOrders,
    refetch,
  } = useQuery({
    queryKey: [
      "purchase_orders",
      currentPage,
      currentSearch,
      currentBrandId,
      filters,
      sorting,
    ],

    queryFn: async () => {
      let query = supabase
        .from("purchase_orders")
        .select(
          `id, purchase_order_date, required_date, branch(name), suppliers(name), notes, status`,
          { count: "exact" },
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .ilike("id", `%${currentSearch}%`)
        .range((currentPage - 1) * 10, currentPage * 10 - 1);

      const sort = sorting[0];

      if (sort) {
        query.order(sort.id, { ascending: sort.desc ? false : true });
      } else {
        query.order("created_at", { ascending: false });
      }

      query = applyFilterQuery(query, filters);

      const result = await query.overrideTypes<PurchaseOrderData[]>();

      if (result.error)
        toast.error("Get Purchase Orders Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const handleClickAction = (type: string) => {
    router.push(`${pathname}/${type}`);
  };

  const [selectedAction, setSelectedAction] = useState<{
    data: PurchaseOrder;
    type: "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const totalData = purchaseOrders?.count ?? 0;

  const totalPages = useMemo(() => {
    return purchaseOrders && purchaseOrders.count !== null
      ? Math.ceil(purchaseOrders.count / 10)
      : 0;
  }, [purchaseOrders]);

  return (
    <div className="w-full">
      <PageHeader
        handleChangeSearch={handleChangeSearch}
        title="Purchase Orders"
        placeholder="Purchase Order ID"
        filters={filters}
        setFilters={setFilters}
        setOpenDialogFilters={setOpenDialogFilters}
        pathname={pathname}
      />
      <DataTable
        isLoading={isLoadingPurchaseOrders}
        data={purchaseOrders?.data ?? []}
        columns={purchaseOrderColumns}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalData={totalData}
        sorting={sorting}
        onSortingChange={setSorting}
        refetch={refetch}
        pathname={pathname}
      />
    </div>
  );
}
