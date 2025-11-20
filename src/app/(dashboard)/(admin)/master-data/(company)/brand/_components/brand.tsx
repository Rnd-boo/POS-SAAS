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
import { Brand } from "@/validations/brand-validation";
import { HEADER_TABLE_BRAND } from "@/constants/brand.constant";
import DialogCreateBrand from "./dialog-create-brand";
import DialogDeleteBrand from "./dialog-delete-brand";
import DialogDetailBrand from "./dialog-detail-brand";
import DialogUpdateBrand from "./dialog-update-brand";

export default function BrandManagement() {
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
    data: brands,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["brand", currentPage, currentLimit, currentSearch, currentId],
    queryFn: async () => {
      const result = await supabase
        .from("brand")
        .select(
          `id,name,status,created_at,updated_at,client_profiles_id, 
          client_profiles:client_profiles_id(name)`,
          {
            count: "exact",
          }
        )
        .eq("clients_id", currentId)
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
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
  const handleView = (row: (string | ReactNode)[], rowIndex: number) => {
    const data = brands?.data?.[rowIndex];
    if (data) {
      setSelectedAction({
        data,
        type: "detail",
      });
    }
  };
  const filteredData = useMemo(() => {
    return (brands?.data || []).map((brand, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        brand.name,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            brand.status ? "bg-green-600" : "bg-red-500"
          )}
        >
          {brand.status ? "Active" : "Not Active"}
        </div>,
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-6 hover:text-muted-foreground hover:!bg-muted-foreground/40"
            onClick={() => {
              setSelectedAction({
                data: brand,
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
                data: brand,
                type: "delete",
              });
            }}
          >
            <Trash2 />
          </Button>
        </div>,
      ];
    });
  }, [brands]);

  const totalPages = useMemo(() => {
    return brands && brands.count !== null
      ? Math.ceil(brands.count / currentLimit)
      : 0;
  }, [brands]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-xl font-semibold">Brand Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by brands name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogCreateBrand refetch={refetch} />
          </Dialog>
        </div>
      </div>
      <DataTable
        handleView={handleView}
        header={HEADER_TABLE_BRAND}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
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
