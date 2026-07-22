import FormInput from "@/components/common/form/form-input";
import FormSelect from "@/components/common/form/form-select";
import FormSelectData from "@/components/common/form/form-select-data";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { STATUS_LIST } from "@/constants/general.constant";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormTableMap<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
}) {
  const { data: branch } = useBranchQuery();

  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle>{type} Table Map</DialogTitle>
          <DialogDescription>
            {type === "Create"
              ? "Add a new Table Map"
              : "Make a changes this Table Map"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 ">
          <div className="space-y-4 max-h-[50vh] overflow-y-auto px-1">
            <FormInput
              form={form}
              name={"name" as Path<T>}
              label="Table Map"
              placeholder="Insert Table Map name"
            />
            <FormSelectData
              form={form}
              name={"branch_id" as Path<T>}
              label="Branch"
              valueKey="id"
              labelKey="name"
              data={branch ?? undefined}
              disabled={type === "Update"}
            />
            <FormSelect
              form={form}
              name={"status" as Path<T>}
              label="Status"
              selectItem={STATUS_LIST}
            />
            <FormInput
              form={form}
              name={"brand_id" as Path<T>}
              label=""
              className="hidden"
              placeholder=""
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isLoading ? <Loader2 className="animate-spin" /> : type}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
