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
import { Category } from "@/validations/products/category-validation";
import { ArrowDown, ArrowUp, Funnel, RefreshCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import DialogFilters from "./dialog-filters";
import { DataTable } from "./tanstack-table";
import { ColumnDef } from "@tanstack/react-table";
import { UnitProduct } from "@/types/products/product-dialog";
import { useBrandStore } from "@/stores/brand-store";

export default function DialogProducts({
  form,
  open,
  mapping,
  onOpenChange,
  setSelectedProduct,
  stock,
}: {
  form: UseFormReturn<any>;
  open: boolean;
  mapping: Record<string, string>;
  onOpenChange: (open: boolean) => void;
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<Record<string, UnitProduct | null>>
  >;
  stock?: boolean;
}) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);
  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();

  const {
    data: productUnit,
    isLoading: isLoadingProductUnit,
    refetch,
  } = useQuery({
    queryKey: ["product_units", currentPage, currentSearch],

    queryFn: async () => {
      const result = await supabase
        .from("product_units")
        .select(
          `id, products_id, units_id, 
            products!inner(name, upc, categories!inner(name)), 
            units!inner(name)`,
          { count: "exact" },
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .eq("products.status", true)
        .order("products(name)")
        .ilike("products.name", `%${currentSearch}%`)
        .range((currentPage - 1) * 10, currentPage * 10 - 1);
      if (result.error)
        toast.error("Get Product Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId && open,
  });

  const data: UnitProduct[] =
    productUnit?.data?.map((row) => ({
      ...row,
      products: Array.isArray(row.products) ? row.products[0] : row.products,
      units: Array.isArray(row.units) ? row.units[0] : row.units,
    })) || [];
  const columns: ColumnDef<UnitProduct>[] = [
    {
      accessorKey: "products",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Product Name
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => (
        <div>{(row.getValue("products") as { name: string })?.name}</div>
      ),
    },
    {
      accessorKey: "categories",
      enableHiding: false,
      header: () => <div>Category</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {
            (row.getValue("products") as { categories: Category })?.categories
              .name
          }
        </div>
      ),
    },
    {
      accessorKey: "upc",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Product Code
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => (
        <div>{(row.getValue("products") as { upc: string })?.upc}</div>
      ),
    },
    {
      accessorKey: "units",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Product Unit
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => (
        <div>{(row.getValue("units") as { name: string }).name}</div>
      ),
    },
  ];

  const totalData = productUnit?.count ?? 0;

  const totalPages = useMemo(() => {
    return productUnit && productUnit.count !== null
      ? Math.ceil(productUnit.count / 10)
      : 0;
  }, [productUnit]);

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);

    if (!isOpen) {
      handleChangeSearch("");
      handleChangePage(1);
    }
  };

  const handleRowClick = (row: UnitProduct) => {
    form.setValue(mapping.products_id, row.products_id, {
      shouldValidate: true,
    });
    form.setValue(mapping.units_id, String(row.id), {
      shouldValidate: true,
    });

    setSelectedProduct((prev) => ({
      ...prev,
      [mapping.key]: row,
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
