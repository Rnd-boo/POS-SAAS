"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Funnel,
  Pencil,
  SearchIcon,
  Trash2,
} from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import { Product } from "@/validations/product-validation";
import { FILTER_TABLE_PRODUCT } from "@/constants/product.constant";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DialogDeleteProduct from "./dialog-delete-product";
import DialogFilters from "@/components/common/dialog-filters";
import { STATUS_LIST } from "@/constants/general.constant";
import { applyFilterQuery } from "@/hooks/use-filter-query";
import { ColumnDef } from "@tanstack/react-table";
import DropdownAction from "@/components/common/dropdown-action";
import { DataTable } from "@/components/common/tanstack-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { config } from "@/middleware";

export default function ProductManagement() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const pathname = usePathname();
  const router = useRouter();
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const {
    currentLimit,
    currentPage,
    handleChangeLimit,
    handleChangePage,
    currentSearch,
    handleChangeSearch,
    setTotalData,
    totalData,
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
    queryKey: ["products", currentPage, currentLimit, currentSearch, filters],
    queryFn: async () => {
      let query = supabase
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

      query = applyFilterQuery(query, filters);

      const result = await query;
      setTotalData(result.count ?? 0);
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
    const data = products?.data?.[rowIndex];
    if (data) {
      router.push(`${pathname}/${data.id}`);
    }
  };

  const data: Product[] = products?.data || [];
  const columns: ColumnDef<Product>[] = [
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
            Product Name
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "categories",
      enableHiding: false,
      header: () => <div>Category</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">
          {row.getValue("categories") !== null
            ? (row.getValue("categories") as unknown as { name: string }).name
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "upc",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Product Code
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("upc")}</div>,
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
              status ? "bg-green-600" : "bg-red-500"
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
                  handleClickAction(`${row?.original.id}/edit`);
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
    return products && products.count !== null
      ? Math.ceil(products.count / currentLimit)
      : 0;
  }, [products]);
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-semibold">Product Management</h1>
      </div>
      <div className="mb-2 flex justify-between ">
        <div className="flex gap-2 w-full max-w-md">
          <InputGroup className="max-w-sm">
            <InputGroupInput
              placeholder="Search by product name"
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenDialogFilters(true)}
          >
            <Funnel />
            Filters
            {Object.keys(filters).length > 0 && (
              <>
                <span className="text-xs font-medium bg-accent rounded-full px-2 py-0.5">
                  {Object.keys(filters).length}
                </span>
                <span
                  className="ml-1 size-6 rounded hover:bg-muted cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilters({});
                  }}
                >
                  x
                </span>
              </>
            )}
          </Button>
        </div>
        <Link href={`${pathname}/create`}>
          <Button variant="outline">Create</Button>
        </Link>
      </div>
      <DataTable
        data={data}
        columns={columns}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalData={totalData}
        refetch={refetch}
      />
      <DialogDeleteProduct
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />{" "}
      <DialogFilters
      configs={FILTER_TABLE_PRODUCT.map((config) => {
        if (config.key === "categories_id") {
          return {
            ...config,
            options: categoriesResult?.map((category) => ({
              value: category.id,
              label: category.name,
            })),
          };
        } else if (config.key === "status") {
          return {
            ...config,
            options: STATUS_LIST,
          };
        }
        return config;
      })}
        onOpenChange={setOpenDialogFilters}
        open={openDialogFilters}
        onChange={setFilters}
      />
    </div>
  );
}
