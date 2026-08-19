"use client";

import DropdownAction from "@/components/common/dropdown-action";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Pencil,
  SquareCheckBig,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { DataTable } from "@/components/common/tanstack-table";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { applyFilterQuery } from "@/hooks/use-filter-query";
import DialogFilters from "@/components/common/dialog/dialog-filters";
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
  const columns: ColumnDef<StockAdjustment>[] = [
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
            Adjustment ID
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "stock_adjustment_date",
      enableHiding: false,
      header: () => <div>Adjustment Date</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {row.getValue("stock_adjustment_date")}
        </div>
      ),
    },
    {
      accessorKey: "branch",
      enableHiding: false,
      header: () => <div>Branch</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {(row.getValue("branch") as { name: string }).name}
        </div>
      ),
    },
    {
      accessorKey: "branch_location",
      enableHiding: false,
      header: () => <div>Location</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {(row.getValue("branch_location") as { name: string }).name}
        </div>
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
        const menu: {
          label?: React.ReactNode;
          variant?: "destructive" | "default";
          action?: () => void;
          separator?: boolean;
        }[] = [
          {
            label: (
              <span className="flex items-center gap-2">
                <Trash2 className="text-red-400" />
                Delete
              </span>
            ),
            variant: "destructive",
            action: () => {
              setSelectedAction({
                data: row.original,
                type: "delete",
              });
            },
          },
        ];
        const status = row.getValue("status");
        if (status !== "authorized" && status !== "rejected") {
          menu.unshift(
            {
              label: (
                <span className="flex items-center gap-2">
                  <SquareCheckBig />
                  Create SA
                </span>
              ),
              action: () => {
                router.push(`${pathname}/create/${row?.original.id}`);
              },
            },
            { separator: true },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Pencil />
                  Edit
                </span>
              ),
              action: () => {
                router.push(`${pathname}/${row?.original.id}/edit`);
              },
            },
          );
        }
        return <DropdownAction menu={menu} />;
      },
    },
  ];

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
