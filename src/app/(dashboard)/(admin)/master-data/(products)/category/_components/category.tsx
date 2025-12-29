"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_CATEGORY } from "@/constants/category.constant";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pen,
  Pencil,
  SearchIcon,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import DialogCreateCategory from "./dialog-create-category";
import DialogUpdateCategory from "./dialog-update-category";
import { Category } from "@/validations/category-validation";
import DialogDeleteCategory from "./dialog-delete-category";
import { useAuthStore } from "@/stores/auth-store";
import { DataTableDemo } from "@/components/common/tanstack-table";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function CategoryManagement() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
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

  const {
    data: categories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "categories",
      currentPage,
      currentLimit,
      currentSearch,
      currentId,
    ],
    queryFn: async () => {
      const result = await supabase
        .from("categories")
        .select("id, name, description, status", { count: "exact" })
        .eq("clients_id", currentId)
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("name")
        .ilike("name", `%${currentSearch}%`);

      setTotalData(result.count ?? 0);

      if (result.error)
        toast.error("Get Category Data Failed", {
          description: result.error.message,
        });
      return result;
    },
    enabled: !!currentId,
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Category;
    type: "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const filteredData = useMemo(() => {
    return (categories?.data || []).map((category, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        category.name,
        <span className="block truncate max-w-xs">{category.description}</span>,
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white w-fit",
            category.status ? "bg-green-600" : "bg-red-500"
          )}
        >
          {category.status ? "Active" : "Not Active"}
        </div>,
        <div className="flex gap-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer size-6 hover:text-muted-foreground hover:!bg-muted-foreground/40"
            onClick={() => {
              setSelectedAction({
                data: category,
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
                data: category,
                type: "delete",
              });
            }}
          >
            <Trash2 />
          </Button>
        </div>,
      ];
    });
  }, [categories]);

  const totalPages = useMemo(() => {
    return categories && categories.count !== null
      ? Math.ceil(categories.count / currentLimit)
      : 0;
  }, [categories]);

  // tanstack section
  const data: Category[] = categories?.data || [];
  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category Name
            <ArrowUpDown className=" size-4" />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "description",
      enableHiding: false,
      header: () => <div>Description</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs">{row.getValue("description")}</div>
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
  //  <div className="flex items-center py-4">
  //         <Input
  //           placeholder={`Search by ${title}`}
  //           onChange={(e) => handleChangeSearch(e.target.value)}
  //           className="max-w-sm"
  //         />
  // <Dialog>
  //         <DialogTrigger asChild>
  //           <Button variant="outline">Create</Button>
  //         </DialogTrigger>
  //         <DialogCreateCategory refetch={refetch} />
  //       </Dialog>
  //       </div>
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl px-2 font-semibold">Category Management</h1>
      </div>
      <div className="mb-2 flex justify-between">
        <InputGroup className="max-w-sm">
          <InputGroupInput
            placeholder="Search by category name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create</Button>
          </DialogTrigger>
          <DialogCreateCategory refetch={refetch} />
        </Dialog>
      </div>
      {/* <DataTable
        header={HEADER_TABLE_CATEGORY}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      /> */}
      <DataTableDemo
        data={data}
        columns={columns}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalData={totalData}
        refetch={refetch}
      />
      <DialogUpdateCategory
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
      />
    </div>
  );
}
