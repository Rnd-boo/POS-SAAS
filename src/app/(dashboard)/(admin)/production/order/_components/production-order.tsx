"use client";

import DialogFilters from "@/components/common/dialog-filters";
import DropdownAction from "@/components/common/dropdown-action";
import PageHeader from "@/components/common/page-header";
import { DataTable } from "@/components/common/tanstack-table";
import { FILTER_TABLE_PRODUCTION_ORDER } from "@/constants/production/production-order.constant";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import useDataTable from "@/hooks/use-data-table";
import { applyFilterQuery } from "@/hooks/use-filter-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import type { ProductionOrder } from "@/validations/production/production-order.validation";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const STATUS_LIST = [
  { value: "new", label: "New" },
  { value: "inprogress", label: "In Progress" },
  { value: "authorized", label: "Authorized" },
];

export default function ProductionOrder() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((state) => state.currentBrandId);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const {
    currentPage,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
    setTotalData,
    totalData,
  } = useDataTable();

  const { data: branches } = useBranchQuery();

  const {
    data: productionOrders,
    isLoading: isLoadingproductionOrders,
    refetch,
  } = useQuery({
    queryKey: [
      "production_orders",
      currentPage,
      currentSearch,
      currentBrandId,
      filters,
      sorting,
    ],

    queryFn: async () => {
      let query = supabase
        .from("production_orders")
        .select(
          `id, production_order_date,branch_id, branch(id,name), notes,status,type, qty, bill_of_materials_id,brand_id`,
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

      const result = await query;

      setTotalData(result.count ?? 0);

      if (result.error)
        toast.error("Get Production Orders Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const handleClickAction = (type: string) => {
    router.push(`${pathname}/${type}`);
  };

  const data: ProductionOrder[] = productionOrders?.data ?? [];
  const columns: ColumnDef<ProductionOrder>[] = [
    {
      accessorKey: "id",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Production Order Number
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "production_order_date",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Production Order Date
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="truncate max-w-xs">
            {row.getValue("production_order_date")}
          </div>
        );
      },
    },
    {
      accessorKey: "notes",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Notes
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="truncate max-w-xs">
            {row.getValue("notes") ? row.getValue("notes") : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "branch",
      enableHiding: false,
      header: () => {
        return <div className="!cursor-default">Branch</div>;
      },
      cell: ({ row }) => (
        <div>{(row.getValue("branch") as { name: string }).name}</div>
      ),
    },
    {
      accessorKey: "status",
      enableHiding: false,
      header: () => <div className="!cursor-default">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="truncate max-w-xs capitalize">
            {row.getValue("status")}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="flex justify-center">Actions</div>,
      cell: ({ row }) => {
        return (
          <DropdownAction
            menu={[
              {
                label: (
                  <span className="flex items-center gap-2">
                    <Pencil />
                    Edit
                  </span>
                ),
                action: () => {
                  handleClickAction(`${row?.original.id}/edit`);
                },
              },
              {
                label: (
                  <span className="flex items-center gap-2">
                    <Trash2 className="text-red-400" />
                    Delete
                  </span>
                ),
                variant: "destructive",
                action: () => {
                  //   setSelectedAction({
                  //     data: row.original,
                  //     type: "delete",
                  //   });
                },
              },
            ]}
          />
        );
      },
    },
  ];

  const totalPages = useMemo(() => {
    return productionOrders && productionOrders.count !== null
      ? Math.ceil(productionOrders.count / 10)
      : 0;
  }, [productionOrders]);

  return (
    <div className="w-full">
      <PageHeader
        handleChangeSearch={handleChangeSearch}
        title="Production Order"
        pathname={pathname}
        filters={filters}
        setFilters={setFilters}
        setOpenDialogFilters={setOpenDialogFilters}
      />
      <DataTable
        data={data}
        columns={columns}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        refetch={refetch}
        sorting={sorting}
        onSortingChange={setSorting}
        totalData={totalData}
        totalPages={totalPages}
      />
      <DialogFilters
        configs={FILTER_TABLE_PRODUCTION_ORDER.map((config) => {
          if (config.key === "status") {
            return {
              ...config,
              options: STATUS_LIST,
            };
          } else if (config.key === "branch_id") {
            return {
              ...config,
              options: branches?.map((branch) => ({
                value: String(branch.id),
                label: branch.name,
              })),
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
