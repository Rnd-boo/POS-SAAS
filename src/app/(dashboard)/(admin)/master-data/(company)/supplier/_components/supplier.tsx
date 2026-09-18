"use client";

import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/tanstack-table";
import DropdownAction from "@/components/common/dropdown-action";
import PageHeader from "@/components/common/page-header";
import { Supplier } from "@/validations/supplier-validation";
import DialogDeleteSupplier from "./dialog-delete-supplier";
import { usePathname, useRouter } from "next/navigation";

export default function SupplierManagement() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const router = useRouter();
  const pathname = usePathname();
  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();
  const {
    data: suppliers,
    refetch,
  } = useQuery({
    queryKey: ["supplier", currentPage, currentSearch, currentId],
    queryFn: async () => {
      const result = await supabase
        .from("supplier")
        .select("*,brand:brand_id(name),supplier_PIC:supplier_pic(*)", {
          count: "exact",
        })
        .eq("clients_id", currentId)
        .range((currentPage - 1) * 10, currentPage * 10 - 1)
        .order("name")
        .ilike("name", `%${currentSearch}%`);
      if (result.error)
        toast.error("Get Supplier Data Failed", {
          description: result.error.message,
        });
      return result;
    },
    enabled: !!currentId,
  });
  const [selectedAction, setSelectedAction] = useState<{
    data: Supplier;
    type: "delete";
  } | null>(null);
  const data = (suppliers?.data ?? []) as unknown as Supplier[];
  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "name",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex items-center gap-2 font-medium"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Supplier Name {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "phone",
      header: () => <div>Phone</div>,
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "payment_method",
      header: () => <div>Payment</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("payment_method")}</div>
      ),
    },
    {
      accessorKey: "status",
      enableHiding: false,
      header: () => <div>Status</div>,
      cell: ({ row }) => (
        <div
          className={cn(
            "w-fit rounded-full px-2 py-1 text-white",
            row.getValue("status") ? "bg-green-600" : "bg-red-500",
          )}
        >
          {row.getValue("status") ? "Active" : "Inactive"}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="flex justify-center">Actions</div>,
      cell: ({ row }) => (
        <DropdownAction
          menu={[
            {
              label: (
                <span className="flex items-center gap-2">
                  <Pencil /> Edit
                </span>
              ),
              action: () => router.push(`${pathname}/${row.original.id}/edit`),
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash2 className="text-red-400" /> Delete
                </span>
              ),
              variant: "destructive",
              action: () =>
                setSelectedAction({ data: row.original, type: "delete" }),
            },
          ]}
        />
      ),
    },
  ];
  const totalPages = useMemo(
    () => (suppliers?.count ? Math.ceil(suppliers.count / 10) : 0),
    [suppliers],
  );
  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };
  return (
    <div className="w-full">
      <PageHeader
        title="supplier"
        pathname={pathname}
        handleChangeSearch={handleChangeSearch}
      />
      <DataTable
        data={data}
        columns={columns}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalData={suppliers?.count ?? 0}
        setSelectedAction={setSelectedAction}
        refetch={refetch}
      />
      <DialogDeleteSupplier
        open={selectedAction?.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
