import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
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
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormBranch<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
}: {
  form: UseFormReturn<T>;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  type: "Create" | "Update";
}) {
  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>{type} Branch</DialogTitle>
        <DialogDescription>
          {type === "Create"
            ? "Add a new Branch"
            : "Make a changes this Branch"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4 ">
        <div className="space-y-4 max-h-[50vh] overflow-y-auto px-1">
          <FormInput
            form={form}
            name={"name" as Path<T>}
            label="Branch"
            placeholder="Insert Branch name"
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
            disabled
            label=""
            className="hidden"
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
  );
}
