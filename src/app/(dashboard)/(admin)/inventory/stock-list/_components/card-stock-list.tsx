"use client";

import { Combobox } from "@/components/common/manual-combobox";
import { DataTable } from "@/components/common/tanstack-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranchLocationQuery } from "@/hooks/queries/use-branch-locations";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import useCategoriesQuery from "@/hooks/queries/use-categories";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { stockListColumns } from "@/components/columns.tsx/stock-list-columns";
import { useQueryState } from "nuqs";
import { ProductStock } from "@/types/inventory/stock-list";
import { STOCK_LIST_FILTERS } from "@/constants/inventory/stock-list.constant";

export default function CardStockList({
  isLoading,
  handleChangePage,
  currentPage,
  filters,
  onChange,
  onSearch,
  data,
  totalPages,
  locationError,
  setLocationError,
  totalData,
}: {
  isLoading?: boolean;
  handleChangePage: (page: number) => void;
  currentPage: number;
  filters: STOCK_LIST_FILTERS;
  onChange: React.Dispatch<React.SetStateAction<STOCK_LIST_FILTERS>>;
  onSearch: () => void;
  data: ProductStock[];
  totalPages: number;
  locationError: string;
  setLocationError: (locationError: string) => void;
  totalData?: number;
}) {
  const { data: branches } = useBranchQuery();
  const [branchId, setBranchId] = useState<string>("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const { categoriesData, isLoadingCategories } =
    useCategoriesQuery(isCategoryOpen);

  const { branchLocations } = useBranchLocationQuery({
    branch_id: branchId,
  });

  useEffect(() => {
    onChange((prev) => ({
      ...prev,
      locationId: "",
    }));
  }, [branchId]);
  const handleRowClick = (row: ProductStock) => {
    console.log(row);
  };
  return (
    <>
      <Card className="w-full">
        <CardHeader className="text-2xl font-semibold">Stock List</CardHeader>
        <CardContent className="grid grid-cols-5 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="">Branch</Label>
            <Combobox
              placeholder="Select Branch"
              modal
              items={
                branches?.map((branch) => ({
                  label: branch.name,
                  value: String(branch.id),
                })) || []
              }
              value={branchId}
              onChange={setBranchId}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="">
              Location <span className="text-destructive">*</span>
            </Label>
            <Select
              value={filters.locationId}
              onValueChange={(value) => {
                setLocationError("");
                onChange((prev) => ({
                  ...prev,
                  locationId: value,
                }));
              }}
              disabled={branchLocations === undefined}
            >
              <SelectTrigger
                className={
                  locationError ? "border-destructive w-full" : "w-full"
                }
              >
                <SelectValue
                  placeholder={
                    branchLocations ? "Select Location" : "Select Branch"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {branchLocations?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {locationError && (
              <p className="text-sm text-destructive">{locationError}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label className="">Category</Label>
            <Combobox
              modal
              placeholder="Select Category"
              onOpenChange={setIsCategoryOpen}
              isLoading={isLoadingCategories}
              items={
                categoriesData?.map((item) => ({
                  label: item.name,
                  value: String(item.id),
                })) || []
              }
              value={filters.categoryId}
              onChange={(value) => {
                onChange((prev) => ({
                  ...prev,
                  categoryId: value,
                }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Product Code</Label>
            <Input
              value={filters.upc}
              onChange={(e) => {
                onChange((prev) => ({
                  ...prev,
                  upc: e.target.value,
                }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Product Name</Label>
            <Input
              value={filters.productName}
              onChange={(e) => {
                onChange((prev) => ({
                  ...prev,
                  productName: e.target.value,
                }));
              }}
            />
          </div>
          <Button className="col-end-6" type="submit" onClick={onSearch}>
            <Search />
            Search
          </Button>
        </CardContent>
      </Card>
      <DataTable
        data={data}
        columns={stockListColumns(currentPage)}
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        tableHeader={false}
        isLoading={isLoading}
        totalData={totalData}
        onRowClick={handleRowClick}
      />
    </>
  );
}
