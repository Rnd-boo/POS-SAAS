"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Funnel, Pencil, Trash2 } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import { Product } from "@/validations/product-validation";
import {
  FILTER_TABLE_PRODUCT,
  HEADER_TABLE_PRODUCT,
} from "@/constants/product.constant";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DialogDeleteProduct from "./dialog-delete-product";
import DialogFilters from "@/components/common/dialog-filters";

export default function ProductManagement() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const pathname = usePathname();
  const router = useRouter();
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);

  const {
    currentLimit,
    currentPage,
    handleChangeLimit,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
  } = useDataTable();

  const { data: categoriesResult } = useQuery({
    queryKey: ["categories", currentId],
    queryFn: async () => {
      const result = await supabase
        .from("categories")
        .select("id, name")
        .eq("status", true)
        .eq("clients_id", currentId);
      return result?.data;
    },
    enabled: !!currentId,
  });

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const result = await supabase
        .from("products")
        .select(
          `id, name,upc,status, description, categories_id, categories (
            name
          )`,
          { count: "exact" }
        )
        .eq("clients_id", currentId)
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("name")
        .ilike("name", `%${currentSearch}%`);

      if (result.error)
        toast.error("Get Product Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Product;
    type: "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const handleClickAction = (type: string) => {
    router.push(`${pathname}/${type}`);
  };

  const handleView = (row: (string | ReactNode)[], rowIndex: number) => {
    // Get the raw data for this row
    const data = products?.data?.[rowIndex];
    if (data) {
      router.push(`${pathname}/${data.id}`);
    }
  };

  const filteredData = useMemo(() => {
    return (products?.data || []).map((product, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        product.name,
        (product.categories as unknown as { name: string }).name,
        product.upc,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            product.status ? "bg-green-600" : "bg-red-500"
          )}
        >
          {product.status ? "Active" : "Not Active"}
        </div>,
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-6 hover:text-muted-foreground hover:!bg-muted-foreground/40"
            onClick={() => {
              handleClickAction(`${product?.id}/edit`);
            }}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-6 text-destructive hover:text-muted-foreground hover:!bg-muted-foreground/40"
            onClick={() => {
              setSelectedAction({
                data: product,
                type: "delete",
              });
            }}
          >
            <Trash2 />
          </Button>
        </div>,
      ];
    });
  }, [products]);

  const totalPages = useMemo(() => {
    return products && products.count !== null
      ? Math.ceil(products.count / currentLimit)
      : 0;
  }, [products]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-xl font-semibold">Product Management</h1>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenDialogFilters(true)}
          >
            <Funnel />
            Filters
          </Button>
          <DialogFilters
            title="Product"
            selectData={categoriesResult ?? []}
            data={FILTER_TABLE_PRODUCT}
            onOpenChange={setOpenDialogFilters}
            open={openDialogFilters}
          />
          <Input
            placeholder="Search by product name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Link href={`${pathname}/create`}>
            <Button variant="outline">Create</Button>
          </Link>
        </div>
      </div>
      <DataTable
        handleView={handleView}
        header={HEADER_TABLE_PRODUCT}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      <DialogDeleteProduct
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
