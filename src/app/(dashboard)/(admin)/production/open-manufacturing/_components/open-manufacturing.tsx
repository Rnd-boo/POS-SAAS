"use client";

import DialogFilters from "@/components/common/dialog/dialog-filters";
import DropdownAction from "@/components/common/dropdown-action";
import { DataTable } from "@/components/common/tanstack-table";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FILTER_TABLE_OPEN_MANUFACTURING } from "@/constants/production/open-manufacturing.constant";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import useDataTable from "@/hooks/use-data-table";
import { applyFilterQuery } from "@/hooks/use-filter-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import type { OpenManufacturing } from "@/validations/production/open-manufacturing.validation";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Funnel,
  Pencil,
  SearchIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import DialogDeleteOpenManufacturing from "./dialog-delete-open-manfacturing";

const STATUS_LIST = [
  { value: "new", label: "New" },
  { value: "rejected", label: "Rejected" },
  { value: "authorized", label: "Authorized" },
];

export default function OpenManufacturing() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((state) => state.currentBrandId);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openDialogFilters, setOpenDialogFilters] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();
  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();

  const { data: branches } = useBranchQuery();

  const {
    data: openManufacturings,
    isLoading: isLoadingOpenManufacturings,
    refetch,
  } = useQuery({
    queryKey: [
      "open_manufacturing",
      currentPage,
      currentSearch,
      currentBrandId,
      filters,
      sorting,
    ],

    queryFn: async () => {
      let query = supabase
        .from("open_manufacturing")
        .select(
          `id, open_manufacturing_date ,branch_id, branch(id,name),type, notes`,
          { count: "exact" },
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .ilike("id", `%${currentSearch}%`)
        .range((currentPage - 1) * 10, currentPage * 10 - 1);

      const sort = sorting[0];

      if (sort) {
        query.order(sort.id, { ascending: sort.desc ? false : true });
      } else {
        query.order("created_at", { ascending: false });
      }

      query = applyFilterQuery(query, filters);

      const result = await query;

      if (result.error)
        toast.error("Get Production Orders Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const handleClickAction = (type: string) => {
    router.push(`${pathname}/${type}`);
  };

  const [selectedAction, setSelectedAction] = useState<{
    data: OpenManufacturing;
    type: "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const data: OpenManufacturing[] = openManufacturings?.data ?? [];
  const columns: ColumnDef<OpenManufacturing>[] = [
    {
      accessorKey: "id",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Open Manufacturing Number
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "open_manufacturing_date",
      enableHiding: false,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Open Manufacturing Date
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="truncate max-w-xs">
            {row.getValue("open_manufacturing_date")}
          </div>
        );
      },
    },

    {
      accessorKey: "branch",
      enableHiding: false,
      header: () => {
        return <div className="!cursor-default">Branch</div>;
      },
      cell: ({ row }) => (
        <div>{(row.getValue("branch") as { name: string }).name}</div>
      ),
    },
    {
      accessorKey: "type",
      enableHiding: false,
      header: () => {
        return <div className="!cursor-default">Type</div>;
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("type")}</div>
      ),
    },
    {
      accessorKey: "notes",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <div
            className="flex gap-2 font-medium items-center"
            onClick={() => column.toggleSorting(undefined, true)}
          >
            Notes
            {sorted === "asc" && <ArrowUp className="size-3" />}
            {sorted === "desc" && <ArrowDown className="size-3" />}
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="truncate max-w-xs">
            {row.getValue("notes") ? row.getValue("notes") : "-"}
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
                variant: "default",
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

  const totalData = openManufacturings?.count ?? 0;

  const totalPages = useMemo(() => {
    return openManufacturings && openManufacturings.count !== null
      ? Math.ceil(openManufacturings.count / 10)
      : 0;
  }, [openManufacturings]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-semibold capitalize">
          Open Manufacturing
        </h1>
      </div>
      <div className="mb-2 flex justify-between ">
        <div className="flex gap-2 w-full max-w-md">
          <InputGroup className="max-w-sm">
            <InputGroupInput
              placeholder={`Search by OM number`}
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          {filters !== undefined && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDialogFilters && setOpenDialogFilters(true)}
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
                      if (setFilters) {
                        setFilters({});
                      }
                    }}
                  >
                    x
                  </span>
                </>
              )}
            </Button>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              Create
              <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full p-0 flex flex-col border-none "
            align="end"
          >
            <Link href={`${pathname}/create?type=assembly`} className="w-full">
              <Button variant="ghost" className="w-full">
                Assembly
              </Button>
            </Link>
            <Link href={`${pathname}/create?type=disassembly`}>
              <Button variant="ghost">Disassembly</Button>
            </Link>
          </PopoverContent>
        </Popover>
      </div>
      <DataTable
        isLoading={isLoadingOpenManufacturings}
        data={data}
        columns={columns}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        refetch={refetch}
        sorting={sorting}
        onSortingChange={setSorting}
        totalData={totalData}
        totalPages={totalPages}
        pathname={pathname}
      />
      <DialogFilters
        configs={FILTER_TABLE_OPEN_MANUFACTURING.map((config) => {
          if (config.key === "branch_id") {
            return {
              ...config,
              options: branches?.map((branch) => ({
                value: String(branch.id),
                label: branch.name,
              })),
            };
          }
          return config;
        })}
        onOpenChange={setOpenDialogFilters}
        open={openDialogFilters}
        onChange={setFilters}
      />
      <DialogDeleteOpenManufacturing
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
