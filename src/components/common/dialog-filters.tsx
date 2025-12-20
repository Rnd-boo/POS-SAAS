import { useMemo, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { STATUS_LIST } from "@/constants/general.constant";
import { Button } from "../ui/button";

export default function DialogFilters({
  open,
  onOpenChange,
  data,
  selectData,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: { value: string; filter: string }[];
  selectData?: any[];
  title: string;
}) {
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<string>("");

  const selectItems = useMemo(() => {
    if (!selectData || selectData.length === 0) return [];
    return selectData.map((item) => ({
      value: item.id?.toString() || "",
      label: item.name || "",
    }));
  }, [selectData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>
        {data?.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_3fr] items-center gap-x-2"
          >
            <div className="text-end">{item.value} :</div>
            {item.filter === "status" ? (
              <Select
                value={currentStatus}
                onValueChange={(value) => setCurrentStatus(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {STATUS_LIST.map((limit) => (
                      <SelectItem key={limit.label} value={limit.value}>
                        {limit.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : item.filter === "select" ? (
              <Select
                value={currentCategory}
                onValueChange={(value) => setCurrentCategory(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectItems?.map((item) => (
                      <SelectItem
                        key={`${item.value}-${item.label}`}
                        value={item.value}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <Input />
            )}
          </div>
        ))}
        <DialogFooter className="!justify-between">
          <div>
            <Button variant="ghost">Reset</Button>
          </div>
          <div className="space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Apply</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
