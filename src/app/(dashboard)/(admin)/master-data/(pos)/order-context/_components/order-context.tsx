"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_ORDER_CONTEXT } from "@/constants/pos/order-context";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { useQuery } from "@tanstack/react-query";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import DialogDeleteOrderContext from "./dialog-delete-order-context";
import type { OrderContext } from "@/validations/pos/order-context.validation";
import DialogCreateOrderContext from "./dialog-create-order-context";
import DialogUpdateOrderContext from "./dialog-update-order-context";

export default function OrderContext() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
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
    data: orderContexts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "order-context",
      currentPage,
      currentLimit,
      currentSearch,
      currentBrandId,
      currentId,
    ],
    queryFn: async () => {
      const result = await supabase
        .from("order_context")
        .select("id,name,status,brand_id", {
          count: "exact",
        })
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .order("name")
        .ilike("name", `%${currentSearch}%`);

      if (result.error) {
        toast.error("Get Order Context data Failed");
      }

      return result;
    },
    enabled: !!currentId,
  });
  const [selectedAction, setSelectedAction] = useState<{
    data: OrderContext;
    type: "detail" | "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };
  const filteredData = useMemo(() => {
    return (orderContexts?.data || []).map((OrderContext, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        OrderContext.name,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            OrderContext.status ? "bg-green-600" : "bg-red-500"
          )}
        >
          {OrderContext.status ? "Active" : "Inactive"}
        </div>,
        <div className="flex items-center max-w-[40px] gap-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-4 hover:text-muted-foreground"
            onClick={() => {
              setSelectedAction({
                data: OrderContext,
                type: "update",
              });
            }}
          >
            <SquarePen />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-4 text-destructive hover:text-muted-foreground"
            onClick={() => {
              setSelectedAction({
                data: OrderContext,
                type: "delete",
              });
            }}
          >
            <Trash2 />
          </Button>
        </div>,
      ];
    });
  }, [orderContexts]);

  const totalPages = useMemo(() => {
    return orderContexts && orderContexts.count !== null
      ? Math.ceil(orderContexts.count / currentLimit)
      : 0;
  }, [orderContexts]);
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-xl font-semibold">Order Context Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by Order Context name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogCreateOrderContext refetch={refetch} />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_ORDER_CONTEXT}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      <DialogDeleteOrderContext
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogUpdateOrderContext
        open={selectedAction !== null && selectedAction.type === "update"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
