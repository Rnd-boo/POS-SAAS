"use client";

import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import DialogCreateTableMap from "./dialog-create-table-map";
import DialogDeleteTableMap from "./dialog-delete-table-map";
import DialogDetailTableMap from "./dialog-detail-table-map";
import DialogUpdateTableMap from "./dialog-update-table-map";
import { Card, CardContent } from "@/components/ui/card";
import { TableMap } from "@/validations/pos/table.validation";
import PageHeader from "@/components/common/page-header";
import { DataTable } from "@/components/common/tanstack-table";
import { ColumnDef } from "@tanstack/react-table";
import DropdownAction from "@/components/common/dropdown-action";

export default function TableMapManagement() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);

  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();

  const {
    data: tableMap,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "table_map",
      currentPage,
      currentSearch,
      currentId,
      currentBrandId,
    ],
    queryFn: async () => {
      const result = await supabase
        .from("table_map")
        .select(
          `id,name,branch_id,brand_id,status,created_at,updated_at,client_profiles_id, branch(name), 
          client_profiles:client_profiles_id(name)`,
          {
            count: "exact",
          },
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .range((currentPage - 1) * 10, currentPage * 10 - 1)
        .order("name")
        .ilike("name", `%${currentSearch}%`);

      if (result.error)
        toast.error("Get Table Map Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: TableMap;
    type: "detail" | "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const handleViewTable = (row: (string | ReactNode)[], rowIndex: number) => {
    const data = tableMap?.data?.[rowIndex];
    if (data) {
      setSelectedAction({
        data,
        type: "detail",
      });
    }
  };

  const data: TableMap[] = tableMap?.data || [];
  const columns: ColumnDef<TableMap>[] = [
    {
      accessorKey: "name",
      enableHiding: false,
      header: () => {
        return (
          <div className="flex gap-2 font-medium items-center">
            Table Map Name
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "branch",
      enableHiding: false,
      header: () => {
        return (
          <div className="flex gap-2 font-medium items-center">Branch Name</div>
        );
      },
      cell: ({ row }) => (
        <div>
          {(row.getValue("branch") as unknown as { name: string }).name}
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

  const totalData = tableMap?.count ?? 0;

  const totalPages = useMemo(() => {
    return tableMap && tableMap.count !== null
      ? Math.ceil(tableMap.count / 10)
      : 0;
  }, [tableMap]);

  return (
    <Card className="w-full">
      <CardContent>
        <PageHeader
          title="table map"
          DialogCreateComponent={<DialogCreateTableMap refetch={refetch} />}
          handleChangeSearch={handleChangeSearch}
        />
        <DataTable
          refetch={refetch}
          data={data}
          totalData={totalData}
          columns={columns}
          totalPages={totalPages}
          currentPage={currentPage}
          onChangePage={handleChangePage}
        />
        <DialogDetailTableMap
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
        <DialogUpdateTableMap
          open={selectedAction !== null && selectedAction.type === "update"}
          refetch={refetch}
          currentData={selectedAction?.data}
          handleChangeAction={handleChangeAction}
        />
        <DialogDeleteTableMap
          open={selectedAction !== null && selectedAction.type === "delete"}
          refetch={refetch}
          currentData={selectedAction?.data}
          handleChangeAction={handleChangeAction}
        />
      </CardContent>
    </Card>
  );
}
