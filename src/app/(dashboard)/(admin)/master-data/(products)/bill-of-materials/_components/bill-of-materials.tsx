"use client";

import { Button } from "@/components/ui/button";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Funnel,
  Pencil,
  SearchIcon,
  Trash2,
} from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { BillOfMaterials } from "@/validations/products/bill-of-materials-validation";
import { Unit } from "@/validations/unit-validation";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import DropdownAction from "@/components/common/dropdown-action";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { DataTable } from "@/components/common/tanstack-table";
import DialogFilters from "@/components/common/dialog-filters";
import { FILTER_TABLE_BOM } from "@/constants/products/bill-of-materials.constant";
import { STATUS_LIST } from "@/constants/general.constant";

export default function BillOfMaterials() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const pathname = usePathname();
  const router = useRouter();
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const {
    currentLimit,
    currentPage,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
    totalData,
    setTotalData,
  } = useDataTable();

  const {
    data: billOfMaterials,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["billOfMaterials", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const result = await supabase
        .from("bill_of_materials")
        .select(
          `id, name, code, type, products_id, product_units_id, status, description, products(id,name), 
            product_units (
              id,products_id,units_id,
              units (id, name)
              )`,
          { count: "exact" }
        )
        .eq("clients_id", currentId)
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("name")
        .or(`name.ilike.%${currentSearch}%,code.ilike.%${currentSearch}%`);
      setTotalData(result.count || 0);
      if (result.error)
        toast.error("Get BOM Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: BillOfMaterials;
    type: "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const handleClickAction = (type: string) => {
    router.push(`${pathname}/${type}`);
  };

  const data: BillOfMaterials[] = billOfMaterials?.data || [];
  const columns: ColumnDef<BillOfMaterials>[] = [
    {
      accessorKey: "name",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Bill Of Material Name
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "code",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Bill Of Material Code
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("code")}</div>,
    },
    {
      accessorKey: "products",
      enableHiding: false,
      header: () => <div>Product</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {(row.getValue("products") as unknown as { name: string }).name}
        </div>
      ),
    },
    {
      accessorKey: "product_units",
      enableHiding: false,
      header: () => <div>Product Unit</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {
            (row.getValue("product_units") as unknown as { units: Unit }).units
              .name
          }
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: () => <div>Type</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs capitalize">
          {row.getValue("type")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      enableHiding: false,
      header: () => <div>Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status");

        return (
          <div
            className={cn(
              "px-2 py-1 rounded-full text-white w-fit",
              status ? "bg-green-600" : "bg-red-500"
            )}
          >
            {status ? "Active" : "Inactive"}
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
                  setSelectedAction({
                    data: row.original,
                    type: "delete",
                  });
                },
              },
            ]}
          />
        );
      },
    },
  ];

  const totalPages = useMemo(() => {
    return billOfMaterials && billOfMaterials.count !== null
      ? Math.ceil(billOfMaterials.count / currentLimit)
      : 0;
  }, [billOfMaterials]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-semibold">Bill Of Materials Management</h1>
      </div>
      <div className="mb-2 flex justify-between ">
        <div className="flex gap-2 w-full max-w-md">
          <InputGroup className="max-w-sm">
            <InputGroupInput
              placeholder="Search by BOM name"
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenDialogFilters(true)}
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
                    setFilters({});
                  }}
                >
                  x
                </span>
              </>
            )}
          </Button>
        </div>
        <Link href={`${pathname}/create`}>
          <Button variant="outline">Create</Button>
        </Link>
      </div>
      <DataTable
        data={data}
        columns={columns}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalData={totalData}
        // sorting={sorting}
        refetch={refetch}
        pathname={pathname}
      />{" "}
      <DialogFilters
        configs={FILTER_TABLE_BOM.map((config) => {
          if (config.key === "status") {
            return {
              ...config,
              options: STATUS_LIST,
            };
          } else if (config.key === "products") {
            return {
              ...config,
              options: billOfMaterials?.data?.map((bom) => ({
                value: (bom.products as unknown as { id: string }).id,
                label: (bom.products as unknown as { name: string }).name,
              })),
            };
          } else if (config.key === "product_units") {
            return {
              ...config,
              options: billOfMaterials?.data?.map((bom) => ({
                value: (bom.product_units as unknown as { units: Unit }).units
                  .id,
                label: (bom.product_units as unknown as { units: Unit }).units
                  .name,
              })),
            };
          } else if (config.key === "type") {
            return {
              ...config,
              options: [
                { label: "Assembly", value: "assembly" },
                { label: "Dissambly", value: "dissambly" },
              ],
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
