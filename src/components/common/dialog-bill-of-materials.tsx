'use client";';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import useDataTable from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, Funnel, RefreshCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import DialogFilters from "./dialog-filters";
import { DataTable } from "./tanstack-table";
import { ColumnDef } from "@tanstack/react-table";
import { useBrandStore } from "@/stores/brand-store";
import { BillOfMaterials } from "@/validations/products/bill-of-materials-validation";
import { Product } from "@/validations/products/product-validation";
import { Unit } from "@/validations/products/unit-validation";
import { applyFilterQuery } from "@/hooks/use-filter-query";

export default function DialogBillOfMaterials({
  form,
  open,
  onOpenChange,
  setSelectedBOM,
}: {
  form: UseFormReturn<any>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setSelectedBOM: React.Dispatch<
    React.SetStateAction<Record<string, BillOfMaterials | null>>
  >;
}) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const {
    currentPage,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
    setTotalData,
    totalData,
  } = useDataTable();

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
                products!inner (name),
                units!inner (name)
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
      setTotalData(result.count || 0);
      if (result.error)
        toast.error("Get BOM Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

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
  ];

  const totalPages = useMemo(() => {
    return billOfMaterials && billOfMaterials.count !== null
      ? Math.ceil(billOfMaterials.count / 10)
      : 0;
  }, [billOfMaterials]);

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);

    if (!isOpen) {
      handleChangeSearch("");
      handleChangePage(1);
    }
  };

  const handleRowClick = (row: BillOfMaterials) => {
    form.setValue("bill_of_materials_id", String(row.id), {
      shouldValidate: true,
    });
    setSelectedBOM((prev) => ({
      ...prev,
      bill_of_materials: row,
    }));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="w-full max-w-[1200px] sm:max-w-[1200px] overflow-auto"
        forceMount
      >
        <DialogHeader>
          <DialogTitle>Products</DialogTitle>
        </DialogHeader>
        <div className="flex w-1/2 ml-auto gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenDialogFilters(true)}
          >
            Filters
            <Funnel />
          </Button>
          <DialogFilters
            onOpenChange={setOpenDialogFilters}
            open={openDialogFilters}
          />
          <Input
            placeholder="Search by Product Name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
        </div>
        <DataTable
          totalData={totalData}
          onRowClick={handleRowClick}
          columns={columns}
          refetch={refetch}
          data={data}
          totalPages={totalPages}
          currentPage={currentPage}
          onChangePage={handleChangePage}
        />
      </DialogContent>
    </Dialog>
  );
}
