import { ReactNode } from "react";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import PaginationDatatable from "./pagination-data-table";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LIMIT_LISTS } from "@/constants/datatable-constant";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export default function DataTable({
  handleView,
  header,
  data,
  isLoading,
  totalPages,
  currentPage,
  currentLimit,
  onChangePage,
  onChangeLimit,
}: {
  handleView?: (row: (string | ReactNode)[], rowIndex: number) => void;
  header: string[];
  data: (string | ReactNode)[][];
  isLoading?: boolean;
  totalPages: number;
  currentPage: number;
  currentLimit: number;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
}) {
  return (
    <div className="w-full flex flex-col gap-4">
      <Card className="p-0">
        <Table className="rounded-lg overflow-hidden w-full">
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              {header.map((column) => (
                <TableHead key={`th-${column}`} className="px-6 py-3">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((row, rowIndex) => (
              <TableRow
                key={`tr-${rowIndex}`}
                onClick={() => handleView?.(row, rowIndex)}
                className="cursor-pointer"
              >
                {row.map((column, columnIndex) => (
                  <TableCell
                    className={cn(
                      "px-6 py-3",
                      columnIndex === row.length - 1 && "w-[80px] break-words"
                    )}
                    key={`tc-${rowIndex}-${columnIndex}`}
                  >
                    {columnIndex === row.length - 1 ? (
                      <div onClick={(e) => e.stopPropagation()}>{column}</div>
                    ) : (
                      column
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {data?.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  No Result Data
                </TableCell>
              </TableRow>
            )}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label>Limit</Label>
          <Select
            value={currentLimit.toString()}
            onValueChange={(value) => onChangeLimit(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Limit</SelectLabel>
                {LIMIT_LISTS.map((limit) => (
                  <SelectItem key={limit} value={limit.toString()}>
                    {limit}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-end">
            <PaginationDatatable
              totalPages={totalPages}
              onChangePage={onChangePage}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
