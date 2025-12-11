'use client";';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import DataTable from "./data-table";
import { ReactNode, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import useDataTable from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Category } from "@/validations/category-validation";
import { Funnel, RefreshCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import DialogFilters from "./dialog-filters";

export default function DialogProducts({
  form,
  open,
  mapping,
  onOpenChange,
  setDisplayNames,
  displayNames,
}: {
  form: UseFormReturn<any>;
  open: boolean;
  mapping: Record<string, string>;
  onOpenChange: (open: boolean) => void;
  setDisplayNames: (displayNames: Record<string, string>) => void;
  displayNames: Record<string, string>;
}) {
  const HEADER_TABLE_PRODUCTS_DIALOG = [
    "No",
    "Product Name",
    "Product Code",
    "Category",
    "Unit",
  ];
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);

  const {
    currentLimit,
    currentPage,
    handleChangeLimit,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
  } = useDataTable();

  const {
    data: productUnit,
    isLoading: isLoadingProductUnit,
    refetch,
  } = useQuery({
    queryKey: ["product_units", currentPage, currentLimit, currentSearch],

    queryFn: async () => {
      const result = await supabase
        .from("product_units")
        .select(
          `id, products_id, units_id, 
            products!inner(name, upc, categories!inner(name)), 
            units!inner(name)`,
          { count: "exact" }
        )
        .eq("clients_id", currentId)
        .order("products(name)")
        .ilike("products.name", `%${currentSearch}%`)
        .range(
          (currentPage - 1) * currentLimit,
          currentPage * currentLimit - 1
        );

      if (result.error)
        toast.error("Get Product Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const filteredData = useMemo(() => {
    return (productUnit?.data || []).map((product, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        (product.products as unknown as { name: string })?.name,
        (product.products as unknown as { upc: string })?.upc,
        (product.products as unknown as { categories: Category })?.categories
          .name,
        (product.units as unknown as { name: string })?.name,
      ];
    });
  }, [productUnit]);

  const totalPages = useMemo(() => {
    return productUnit && productUnit.count !== null
      ? Math.ceil(productUnit.count / currentLimit)
      : 0;
  }, [productUnit]);

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);

    if (!isOpen) {
      handleChangeSearch("");
      handleChangePage(1);
    }
  };
  const handleRowClick = (row: (string | ReactNode)[], rowIndex: number) => {
    const data = productUnit?.data?.[rowIndex];
    Object.entries(mapping).forEach(([dataKey, formKey]) => {
      const value = (data as any)[dataKey];
      const finalValue = typeof value === "object" ? value.name : value;
      form.setValue(formKey, finalValue);
    });
    setDisplayNames({
      ...displayNames,
      [mapping.products_id]: (data?.products as { name?: string })?.name ?? "",
      [mapping.units_id]: (data?.units as { name?: string })?.name ?? "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="w-full max-w-[1200px] sm:max-w-[1200px]"
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
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => refetch()}
          >
            <RefreshCcw />
          </Button>
        </div>
        <DataTable
          handleView={handleRowClick}
          header={HEADER_TABLE_PRODUCTS_DIALOG}
          data={filteredData}
          totalPages={totalPages}
          currentPage={currentPage}
          currentLimit={currentLimit}
          onChangePage={handleChangePage}
          onChangeLimit={handleChangeLimit}
        />
      </DialogContent>
    </Dialog>
  );
}
