"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Product } from "@/validations/product-validation";
import { HEADER_TABLE_PRODUCT } from "@/constants/product.constant";
import { useAuthStore } from "@/stores/auth-store";
import DialogCreateProduct from "./dialog-create-product";

export default function ProductManagement() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const {
    currentLimit,
    currentPage,
    handleChangeLimit,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
  } = useDataTable();

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
          `*, categories (
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
    type: "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const filteredData = useMemo(() => {
    return (products?.data || []).map((product, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        product.name,
        product.categories.name,
        product.upc,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            product.status ? "bg-green-600" : "bg-red-500"
          )}
        >
          {product.status ? "Active" : "Not Active"}
        </div>,
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
                setSelectedAction({
                  data: product,
                  type: "update",
                });
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
                  data: product,
                  type: "delete",
                });
              },
            },
          ]}
        />,
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
          {/* <Input
            placeholder="Search by product name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          /> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogCreateProduct refetch={refetch} />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_PRODUCT}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      {/* <DialogUpdateCategory
        open={selectedAction !== null && selectedAction.type === "update"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteCategory
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      /> */}
    </div>
  );
}
