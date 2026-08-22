'use client";';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import useDataTable from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Funnel } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import DialogFilters from "./dialog-filters";
import { DataTable } from "../tanstack-table";
import { SortingState } from "@tanstack/react-table";
import { UnitProduct } from "@/types/products/product-dialog";
import { useBrandStore } from "@/stores/brand-store";
import { useProductStockQuery } from "@/hooks/queries/use-product-stocks";
import { productUnitColumns } from "@/components/columns.tsx/product-units-columns";

export default function DialogProducts({
  form,
  open,
  mapping,
  onOpenChange,
  setSelectedProduct,
  branch_location_id,
  canSelectProduct, //Checking there not duplicate the product_id
}: {
  form: UseFormReturn<any>;
  open: boolean;
  mapping: Record<string, string>;
  onOpenChange: (open: boolean) => void;
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<Record<string, UnitProduct | null>>
  >;
  branch_location_id?: string;
  canSelectProduct?: (product: UnitProduct) => boolean;
}) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);
  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();
  const [sorting, setSorting] = useState<SortingState>([]);
  const {
    data: productUnit,
    isLoading: isLoadingProductUnit,
    refetch: refetchProductUnit,
  } = useQuery({
    queryKey: ["product_units", currentPage, currentSearch, sorting],

    queryFn: async () => {
      const query = supabase
        .from("product_units")
        .select(
          `id, products_id, units_id, conversion_factor,
            products!inner(name, upc, categories!inner(name)), 
            units!inner(name)`,
          { count: "exact" },
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .eq("products.status", true)
        .ilike("products.name", `%${currentSearch}%`)
        .range((currentPage - 1) * 10, currentPage * 10 - 1);

      const sort = sorting[0];

      if (sort) {
        query.order(sort.id, { ascending: sort.desc ? false : true });
      } else {
        query.order("products(name)");
      }
      const result = await query;

      if (result.error)
        toast.error("Get Product Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId && open,
  });

  const { productStock, refetchProductStock } = useProductStockQuery({
    branch_location_id: branch_location_id,
    productIds: productUnit?.data?.map((r: any) => r.products_id) ?? [],
  });

  const data: UnitProduct[] =
    productUnit?.data?.map((row) => {
      const product = Array.isArray(row.products)
        ? row.products[0]
        : row.products;
      const unitProduct = {
        ...row,
        products: {
          ...product,
        },
        units: Array.isArray(row.units) ? row.units[0] : row.units,
      };

      const stockItem = productStock?.data?.find(
        (stockRow) => stockRow.products_id === unitProduct.products_id,
      );

      return {
        ...unitProduct,
        on_hand: Number(
          (
            (stockItem?.on_hand ?? 0) / (unitProduct.conversion_factor ?? 1)
          ).toFixed(4),
        ),
      };
    }) || [];

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
    if (canSelectProduct && !canSelectProduct(row)) return;

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

  const handleRefetchProducts = () => {
    if (branch_location_id) {
      refetchProductStock?.();
    }
    refetchProductUnit?.();
  };

  const columns = useMemo(() => {
    const showStockColumn = !!branch_location_id;
    return showStockColumn
      ? productUnitColumns
      : productUnitColumns.filter((col) => col.id !== "on_hand");
  }, [branch_location_id]);

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
          refetch={handleRefetchProducts}
          data={data}
          totalPages={totalPages}
          currentPage={currentPage}
          onChangePage={handleChangePage}
          sorting={sorting}
          onSortingChange={setSorting}
        />
      </DialogContent>
    </Dialog>
  );
}
