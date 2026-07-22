"use client";

import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import type { BillOfMaterials } from "@/validations/products/bill-of-materials-validation";
import { Unit } from "@/validations/products/unit-validation";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import DropdownAction from "@/components/common/dropdown-action";
import { DataTable } from "@/components/common/tanstack-table";
import DialogFilters from "@/components/common/dialog/dialog-filters";
import { FILTER_TABLE_BOM } from "@/constants/products/bill-of-materials.constant";
import { STATUS_LIST } from "@/constants/general.constant";
import PageHeader from "@/components/common/page-header";
import { Product } from "@/validations/products/product-validation";
import { applyFilterQuery } from "@/hooks/use-filter-query";
import { useBrandStore } from "@/stores/brand-store";
import DialogDeleteBillOfMaterials from "./dialog-delete-bill-of-materials";

export default function BillOfMaterials() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const pathname = usePathname();
  const router = useRouter();
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();

  const {
    data: billOfMaterials,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "billOfMaterials",
      currentPage,
      currentSearch,
      filters,
      currentBrandId,
    ],
    queryFn: async () => {
      let query = supabase
        .from("bill_of_materials")
        .select(
          `id, name, code, type, product_units_id, status, description,  
            product_units!inner (
              id,products_id,units_id,
              products!inner (id,name),
              units!inner (id, name)
              )`,
          { count: "exact" },
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .range((currentPage - 1) * 10, currentPage * 10 - 1)
        .order("name")
        .or(`name.ilike.%${currentSearch}%,code.ilike.%${currentSearch}%`);

      query = applyFilterQuery(query, filters);

      const result = await query;
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
      enablePinning: true,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center "
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
          {
            (row.getValue("product_units") as { products: Product }).products
              .name
          }
        </div>
      ),
    },
    {
      accessorKey: "product_units",
      enableHiding: false,
      header: () => <div>Product Unit</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {(row.getValue("product_units") as { units: Unit }).units.name}
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
              status ? "bg-green-600" : "bg-red-500",
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
      enablePinning: true,
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

  const totalData = billOfMaterials?.count ?? 0;

  const totalPages = useMemo(() => {
    return billOfMaterials && billOfMaterials.count !== null
      ? Math.ceil(billOfMaterials.count / 10)
      : 0;
  }, [billOfMaterials]);

  return (
    <div className="w-full">
      <PageHeader
        handleChangeSearch={handleChangeSearch}
        title="bill of materials"
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
        // sorting={sorting}
        refetch={refetch}
        pathname={pathname}
      />{" "}
      <DialogFilters
        configs={FILTER_TABLE_BOM.map((config) => {
          const optionsProduct = Array.from(
            new Map(
              billOfMaterials?.data
                ?.map(
                  (bom) =>
                    (bom.product_units as { products?: Product })?.products,
                )
                .filter((p): p is Product => Boolean(p))
                .map((p) => [p.id, { value: p.id, label: p.name }]),
            ).values(),
          );
          const optionsProductUnit = Array.from(
            new Map(
              billOfMaterials?.data
                ?.map((bom) => (bom.product_units as { units?: Unit })?.units)
                .filter((p): p is Unit => Boolean(p))
                .map((p) => [p.id, { value: p.id, label: p.name }]),
            ).values(),
          );
          if (config.key === "status") {
            return {
              ...config,
              options: STATUS_LIST,
            };
          } else if (config.key === "product_units.products.id") {
            return {
              ...config,
              options: optionsProduct,
            };
          } else if (config.key === "product_units.units.id") {
            return {
              ...config,
              options: optionsProductUnit,
            };
          } else if (config.key === "type") {
            return {
              ...config,
              options: [
                { label: "Assembly", value: "assembly" },
                { label: "Disassembly", value: "disassembly" },
              ],
            };
          }
          return config;
        })}
        onOpenChange={setOpenDialogFilters}
        open={openDialogFilters}
        onChange={setFilters}
      />
      <DialogDeleteBillOfMaterials
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
