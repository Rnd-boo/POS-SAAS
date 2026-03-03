"use client";

import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Pencil, SearchIcon, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { Brand } from "@/validations/brand-validation";
import DialogCreateBrand from "./dialog-create-brand";
import DialogDeleteBrand from "./dialog-delete-brand";
import DialogDetailBrand from "./dialog-detail-brand";
import DialogUpdateBrand from "./dialog-update-brand";
import { ColumnDef } from "@tanstack/react-table";
import DropdownAction from "@/components/common/dropdown-action";
import { DataTable } from "@/components/common/tanstack-table";
import PageHeader from "@/components/common/page-header";

export default function BrandManagement() {
  const supabase = createClient();

  const currentId = useAuthStore((state) => state.profile?.clients);

  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();

  const {
    data: brands,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["brand", currentPage, currentSearch, currentId],
    queryFn: async () => {
      const result = await supabase
        .from("brand")
        .select(
          `id,name,status,created_at,updated_at,client_profiles_id, 
          client_profiles:client_profiles_id(name)`,
          {
            count: "exact",
          },
        )
        .eq("clients_id", currentId)
        .range((currentPage - 1) * 10, currentPage * 10 - 1)
        .order("name")
        .ilike("name", `%${currentSearch}%`);

      if (result.error)
        toast.error("Get Brand Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Brand;
    type: "detail" | "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const data: Brand[] = brands?.data || [];
  const columns: ColumnDef<Brand>[] = [
    {
      accessorKey: "name",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Brand Name
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
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

  const totalData = brands?.count ?? 0;

  const totalPages = useMemo(() => {
    return brands && brands.count !== null ? Math.ceil(brands.count / 10) : 0;
  }, [brands]);

  return (
    <div className="w-full">
      <PageHeader
        title="brand"
        handleChangeSearch={handleChangeSearch}
        DialogCreateComponent={<DialogCreateBrand refetch={refetch} />}
      />
      <DataTable
        data={data}
        columns={columns}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalData={totalData}
        setSelectedAction={setSelectedAction}
        // sorting={sorting}
        // onSortingChange={setSorting}
        refetch={refetch}
      />
      <DialogDetailBrand
        open={selectedAction !== null && selectedAction.type === "detail"}
        handleChangeAction={handleChangeAction}
        informationData={[
          {
            label: "Created By",
            value: (
              selectedAction?.data?.client_profiles as unknown as {
                name: string;
              }
            )?.name,
          },
          {
            label: "Created At",
            value: selectedAction?.data?.created_at,
          },
          {
            label: "Updated At",
            value: selectedAction?.data?.updated_at,
          },
        ]}
      />
      <DialogUpdateBrand
        open={selectedAction !== null && selectedAction.type === "update"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteBrand
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
