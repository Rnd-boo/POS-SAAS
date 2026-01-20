"use client";

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
import { Pencil, Trash2 } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import DialogDeleteOrderContext from "./dialog-delete-order-context";
import type { OrderContext } from "@/validations/pos/order-context.validation";
import DialogCreateOrderContext from "./dialog-create-order-context";
import DialogUpdateOrderContext from "./dialog-update-order-context";
import DialogDetailOrderContext from "./dialog-detail-order-context";
import { DataTable } from "@/components/common/tanstack-table";
import { ColumnDef } from "@tanstack/react-table";
import DropdownAction from "@/components/common/dropdown-action";

export default function OrderContext() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);

  const {
    currentPage,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
    totalData,
    setTotalData,
  } = useDataTable();

  const {
    data: orderContexts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "order-context",
      currentPage,
      currentSearch,
      currentBrandId,
      currentId,
    ],
    queryFn: async () => {
      const result = await supabase
        .from("order_context")
        .select(
          "id,name,status,brand_id,tax_value,tax_name,other_tax_value,other_tax_name",
          {
            count: "exact",
          },
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .order("name")
        .ilike("name", `%${currentSearch}%`);

      setTotalData(result.count || 0);
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
  const handleClickAction = (row: OrderContext) => {
    setSelectedAction({
      data: row,
      type: "detail",
    });
  };

  const data: OrderContext[] = orderContexts?.data || [];
  const columns: ColumnDef<OrderContext>[] = [
    {
      accessorKey: "name",
      enableHiding: false,
      header: ({ column }) => {
        return (
          <div className="flex gap-2 font-medium items-center">
            Order Context Name
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "notes",
      enableHiding: false,
      header: () => <div>Notes</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {row.getValue("notes") !== null ? row.getValue("notes") : "-"}
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
                  setSelectedAction({
                    data: row.original,
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
    return orderContexts && orderContexts.count !== null
      ? Math.ceil(orderContexts.count / 10)
      : 0;
  }, [orderContexts]);
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-xl font-semibold">Order Context Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by Order Context"
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
        onRowClick={handleClickAction}
        totalData={totalData}
        refetch={refetch}
        data={data}
        columns={columns}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
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
      <DialogDetailOrderContext
        open={selectedAction !== null && selectedAction.type === "detail"}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
