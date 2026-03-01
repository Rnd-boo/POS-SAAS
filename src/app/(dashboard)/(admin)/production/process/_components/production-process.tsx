"use client";

import DialogFilters from "@/components/common/dialog-filters";
import DropdownAction from "@/components/common/dropdown-action";
import { DataTable } from "@/components/common/tanstack-table";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FILTER_TABLE_PRODUCTION_PROCESS } from "@/constants/production/production-process.constant";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import useDataTable from "@/hooks/use-data-table";
import { applyFilterQuery } from "@/hooks/use-filter-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import type { ProductionProcess } from "@/validations/production/production-process.validation";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  Funnel,
  Pencil,
  SearchIcon,
  SquareCheckBig,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const STATUS_LIST = [
  { value: "new", label: "New" },
  { value: "inprogress", label: "In Progress" },
  { value: "authorized", label: "Authorized" },
];
export default function ProductionProcess() {
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
    data: productionProcess,
    isLoading: isLoadingProductionProcess,
    refetch,
  } = useQuery({
    queryKey: [
      "production_process",
      currentPage,
      currentSearch,
      currentBrandId,
      filters,
      sorting,
    ],

    queryFn: async () => {
      let query = supabase
        .from("production_process")
        .select(
          `id, production_process_date, production_orders_id, branch_id, branch(name), notes, status`,
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

  const [selectedAction, setSelectedAction] = useState<{
    data: ProductionProcess;
    type: "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const data: ProductionProcess[] = productionProcess?.data ?? [];
  const columns: ColumnDef<ProductionProcess>[] = [
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
            Production Process Number
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "production_process_date",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Production Process Date
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="truncate max-w-xs">
            {row.getValue("production_process_date")}
          </div>
        );
      },
    },
    {
      accessorKey: "production_orders_id",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Production Orders
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => {
        const productionOrderId = row.getValue(
          "production_orders_id",
        ) as string;
        return (
          <div
            className="truncate max-w-xs text-primary hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Link href={`/production/orders/${productionOrderId}`}>
              {productionOrderId}
            </Link>
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
      accessorKey: "notes",
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
                  Create PO
                </span>
              ),
              action: () => {
                handleClickAction(`create/${row?.original.id}`);
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
                handleClickAction(`${row?.original.id}/edit`);
              },
            },
          );
        }
        return <DropdownAction menu={menu} />;
      },
    },
  ];

  const totalPages = useMemo(() => {
    return productionProcess && productionProcess.count !== null
      ? Math.ceil(productionProcess.count / 10)
      : 0;
  }, [productionProcess]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-semibold capitalize">
          Production Process
        </h1>
      </div>
      <div className="mb-2 flex justify-between ">
        <div className="flex gap-2 w-full max-w-md">
          <InputGroup className="max-w-sm">
            <InputGroupInput
              placeholder={`Search by production process number`}
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          {filters !== undefined && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDialogFilters && setOpenDialogFilters(true)}
            >
              <Funnel />
              Filters
              {Object.keys(filters).length > 0 && (
                <>
                  <span className="text-xs font-medium bg-accent rounded-full px-2 py-0.5">
                    {Object.keys(filters).length}
                  </span>
                  <span
                    className="ml-1 size-6 rounded hover:bg-muted cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (setFilters) {
                        setFilters({});
                      }
                    }}
                  >
                    x
                  </span>
                </>
              )}
            </Button>
          )}
        </div>
        <Link href={`${pathname}/create`}>
          <Button variant="outline">Create</Button>
        </Link>
      </div>
      <DataTable
        isLoading={isLoadingProductionProcess}
        data={data}
        columns={columns}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        refetch={refetch}
        sorting={sorting}
        onSortingChange={setSorting}
        totalData={totalData}
        totalPages={totalPages}
        pathname={pathname}
      />
      <DialogFilters
        configs={FILTER_TABLE_PRODUCTION_PROCESS.map((config) => {
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
