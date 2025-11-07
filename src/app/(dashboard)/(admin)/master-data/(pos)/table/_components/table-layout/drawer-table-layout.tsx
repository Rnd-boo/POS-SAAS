"use client";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { SHAPE_LIST } from "@/constants/pos/table.constant";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import { TableLayoutForm } from "@/validations/pos/table.validation";

export default function DrawerTableLayout<T extends FieldValues>({
  selectedIndex,
  form,
  fields,
  handleAddTable,
  remove,
}: {
  selectedIndex: number | null;
  form: UseFormReturn<TableLayoutForm>;
  fields: any[];
  handleAddTable: () => void;
  remove: (index: number) => void;
}) {
  const shape =
    selectedIndex !== null ? form.watch(`tables.${selectedIndex}.shape`) : "";
  const width =
    selectedIndex !== null ? form.watch(`tables.${selectedIndex}.width`) : 0;

  useEffect(() => {
    if (shape === "circle" && typeof selectedIndex === "number") {
      form.setValue(`tables.${selectedIndex}.height`, width);
    }
  }, [shape, width, selectedIndex]);
  return (
    <DrawerContent className="!w-[16rem]">
      <DrawerHeader>
        <DrawerTitle>Tables</DrawerTitle>
        <Button variant="ghost" className="w-full" onClick={handleAddTable}>
          <CirclePlus /> Add new Table
        </Button>
      </DrawerHeader>
      {selectedIndex !== null && fields[selectedIndex] && (
        <div className="px-4 flex flex-col overflow-y-auto">
          <div className="space-y-4">
            <div
              className="flex flex-col gap-2"
              key={`tables.${selectedIndex}.id`}
            >
              <div className="space-y-2">
                <DrawerDescription>Table Description</DrawerDescription>
                <FormInput
                  form={form}
                  name={`tables.${selectedIndex}.name`}
                  label="Table Name"
                  placeholder="Insert Table name"
                />
                <FormInput
                  type="number"
                  form={form}
                  name={`tables.${selectedIndex}.capacity`}
                  label="Capacity"
                  placeholder="Insert Capacity of Table"
                />
                <FormSelect
                  form={form}
                  name={`tables.${selectedIndex}.status`}
                  label="Status"
                  selectItem={[
                    { value: true, label: "Active" },
                    { value: false, label: "Not Active" },
                  ]}
                />
              </div>
              <div className="mt-4 space-y-2 mb-2">
                <DrawerDescription>Layout</DrawerDescription>
                <div className="flex items-center gap-2 text-sm">
                  <p>Position</p>
                  <div className="flex gap-2">
                    <FormInput
                      form={form}
                      name={`tables.${selectedIndex}.position_x`}
                      label=""
                      placeholder=""
                    />
                    <FormInput
                      form={form}
                      name={`tables.${selectedIndex}.position_y`}
                      label=""
                      placeholder=""
                    />
                  </div>
                </div>
                <FormSelect
                  form={form}
                  name={`tables.${selectedIndex}.shape`}
                  label="Shape Type"
                  selectItem={SHAPE_LIST}
                />
                <FormInput
                  form={form}
                  name={`tables.${selectedIndex}.width`}
                  label="Width"
                  placeholder="Insert Width of Table"
                />
                {shape !== "circle" && (
                  <FormInput
                    form={form}
                    name={`tables.${selectedIndex}.height`}
                    label="Height"
                    placeholder="Insert Height of Table"
                  />
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  remove(selectedIndex);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </DrawerContent>
  );
}
