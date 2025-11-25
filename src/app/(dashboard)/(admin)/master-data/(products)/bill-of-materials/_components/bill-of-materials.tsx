"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { BillOfMaterials } from "@/validations/products/bill-of-materials-validation";
import { Unit } from "@/validations/unit-validation";
import { HEADER_TABLE_BOM } from "@/constants/products/bill-of-materials.constant";

export default function BillOfMaterials() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const pathname = usePathname();
  const router = useRouter();

  const {
    currentLimit,
    currentPage,
    handleChangeLimit,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
  } = useDataTable();

  const {
    data: billOfMaterials,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["billOfMaterials", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const result = await supabase
        .from("bill_of_materials")
        .select(
          `id, name, code, type, products_id, product_units_id, status, description, products(name), 
            product_units (
              id,products_id,units_id,
              units (id, name)
              )`,
          { count: "exact" }
        )
        .eq("clients_id", currentId)
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("name")
        .or(`name.ilike.%${currentSearch}%,code.ilike.%${currentSearch}%`);

      if (result.error)
        toast.error("Get BOM Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: BillOfMaterials;
    type: "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const handleClickAction = (type: string) => {
    router.push(`${pathname}/${type}`);
  };

  const handleView = (row: (string | ReactNode)[], rowIndex: number) => {
    const data = billOfMaterials?.data?.[rowIndex];
    if (data) {
      router.push(`${pathname}/${data.id}`);
    }
  };

  const filteredData = useMemo(() => {
    return (billOfMaterials?.data || []).map((bom, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        bom.name,
        bom.code,
        <p className="capitalize">{bom.type}</p>,
        (bom.products as unknown as { name: string }).name,
        (bom.product_units as unknown as { units: Unit }).units.name,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            bom.status ? "bg-green-600" : "bg-red-500"
          )}
        >
          {bom.status ? "Active" : "Not Active"}
        </div>,
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-6 hover:text-muted-foreground hover:!bg-muted-foreground/40"
            onClick={() => {
              handleClickAction(`${bom?.id}/edit`);
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
                data: bom,
                type: "delete",
              });
            }}
          >
            <Trash2 />
          </Button>
        </div>,
      ];
    });
  }, [billOfMaterials]);

  const totalPages = useMemo(() => {
    return billOfMaterials && billOfMaterials.count !== null
      ? Math.ceil(billOfMaterials.count / currentLimit)
      : 0;
  }, [billOfMaterials]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-xl font-semibold">Bill Of Materials Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by BOM or code"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Link href={`${pathname}/create`}>
            <Button variant="outline">Create</Button>
          </Link>
        </div>
      </div>
      <DataTable
        handleView={handleView}
        header={HEADER_TABLE_BOM}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
    </div>
  );
}
