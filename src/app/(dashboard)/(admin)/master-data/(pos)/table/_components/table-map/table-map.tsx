"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { HEADER_TABLE_TABLE_MAP } from "@/constants/pos/table.constant";
import DialogCreateTableMap from "./dialog-create-table-map";
import DialogDeleteTableMap from "./dialog-delete-table-map";
import DialogDetailTableMap from "./dialog-detail-table-map";
import DialogUpdateTableMap from "./dialog-update-table-map";
import { Card, CardContent } from "@/components/ui/card";
import { TableMap } from "@/validations/pos/table.validation";

export default function TableMapManagement() {
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
    data: tableMap,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "table_map",
      currentPage,
      currentLimit,
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
          }
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
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

  const filteredData = useMemo(() => {
    return (tableMap?.data || []).map((table, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        table.name,
        (table.branch as unknown as { name: string }).name,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            table.status ? "bg-green-600" : "bg-red-500"
          )}
        >
          {table.status ? "Active" : "Not Active"}
        </div>,
        <div className="flex  gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-6 hover:text-muted-foreground hover:!bg-muted-foreground/40"
            onClick={() => {
              setSelectedAction({
                data: table,
                type: "update",
              });
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
                data: table,
                type: "delete",
              });
            }}
          >
            <Trash2 />
          </Button>
        </div>,
      ];
    });
  }, [tableMap]);

  const totalPages = useMemo(() => {
    return tableMap && tableMap.count !== null
      ? Math.ceil(tableMap.count / currentLimit)
      : 0;
  }, [tableMap]);

  return (
    <Card className="w-full">
      <CardContent>
        <div className=" flex lg:flex-row items-center  justify-between mb-4 w-full">
          <h1 className="font-semibold text-2xl px-2">Table Map</h1>
          <div className="flex gap-2">
            <Input
              placeholder="Search by Table Map"
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Create</Button>
              </DialogTrigger>
              <DialogCreateTableMap refetch={refetch} />
            </Dialog>
          </div>
        </div>
        <DataTable
          handleView={handleViewTable}
          header={HEADER_TABLE_TABLE_MAP}
          isLoading={isLoading}
          data={filteredData}
          totalPages={totalPages}
          currentPage={currentPage}
          currentLimit={currentLimit}
          onChangePage={handleChangePage}
          onChangeLimit={handleChangeLimit}
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
