"use client";

import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/tanstack-table";
import PageHeader from "@/components/common/page-header";
import DialogDeleteSupplier from "./dialog-delete-supplier";
import { usePathname, useRouter } from "next/navigation";
import { supplierColumns } from "@/components/columns.tsx/suppliers-columns";
import { useBrandStore } from "@/stores/brand-store";
import { SupplierData } from "@/types/supplier";
import { applyFilterQuery } from "@/hooks/use-filter-query";
import { SortingState } from "@tanstack/react-table";
import DialogFilters from "@/components/common/dialog/dialog-filters";
import { FILTER_TABLE_SUPPLIER } from "@/constants/supplier.constant";
import { STATUS_LIST } from "@/constants/general.constant";

export default function SupplierManagement() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((state) => state.currentBrandId);
  const pathname = usePathname();
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);
  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();
  const {
    data: suppliers,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      "suppliers",
      currentPage,
      currentSearch,
      currentId,
      filters,
      currentBrandId,
      sorting,
    ],
    queryFn: async () => {
      let query = supabase
        .from("suppliers")
        .select(
          "id,name,address,credit_terms,notes,supplier_pic!inner(name),status",
          {
            count: "exact",
          },
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .eq("supplier_pic.is_default", true)
        .range((currentPage - 1) * 10, currentPage * 10 - 1)
        .ilike("name", `%${currentSearch}%`);
      const sort = sorting[0];
      if (sort) {
        query.order(sort.id, { ascending: sort.desc ? false : true });
      } else {
        query.order("created_at", { ascending: false });
      }
      query = applyFilterQuery(query, filters);

      const result = await query.overrideTypes<SupplierData[]>();

      if (result.error)
        toast.error("Get Supplier Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId && !!currentBrandId,
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: SupplierData;
    type: "delete";
  } | null>(null);

  const data = suppliers?.data ?? [];
  const totalPages = useMemo(
    () => (suppliers?.count ? Math.ceil(suppliers.count / 10) : 0),
    [suppliers],
  );

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };
  return (
    <div className="w-full">
      <PageHeader
        title="supplier"
        placeholder="supplier name"
        pathname={pathname}
        filters={filters}
        setFilters={setFilters}
        setOpenDialogFilters={setOpenDialogFilters}
        handleChangeSearch={handleChangeSearch}
      />
      <DataTable
        data={data}
        isLoading={isLoading}
        columns={supplierColumns({
          router: router,
          pathname,
          setSelectedAction,
        })}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        sorting={sorting}
        onSortingChange={setSorting}
        totalData={suppliers?.count ?? 0}
        refetch={refetch}
        pathname={pathname}
      />
      <DialogDeleteSupplier
        open={selectedAction?.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogFilters
        configs={FILTER_TABLE_SUPPLIER.map((config) => {
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
      />
    </div>
  );
}
