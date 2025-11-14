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

export default function FormOrderContext<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
}: {
  form: UseFormReturn<T>;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  type: "Create" | "Update" | "Detail";
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle>{type} Order Context</DialogTitle>
          {type !== "Detail" && (
            <DialogDescription>
              {type === "Create"
                ? "Add a new Order Context"
                : "Make a changes this Order Context"}
            </DialogDescription>
          )}
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 ">
          <div className="space-y-4 max-h-[50vh] overflow-y-auto px-1">
            <FormInput
              form={form}
              name={"name" as Path<T>}
              label="Order Context"
              placeholder="Insert Order Context name"
              disabled={type === "Detail"}
            />
            <div className="flex gap-4">
              <FormInput
                form={form}
                name={"tax_name" as Path<T>}
                label="Tax Name"
                placeholder="Insert Tax Name"
                disabled={type === "Detail"}
              />
              <FormInput
                form={form}
                name={"tax_value" as Path<T>}
                label="Tax Value"
                placeholder="Insert Tax Value "
                disabled={type === "Detail"}
              />
            </div>
            <div className="flex gap-4">
              <FormInput
                form={form}
                name={"other_tax_name" as Path<T>}
                label="Other Tax Name"
                placeholder="Optional"
                disabled={type === "Detail"}
              />
              <FormInput
                form={form}
                name={"other_tax_value" as Path<T>}
                label="Other Tax Value"
                placeholder="Optional"
                disabled={type === "Detail"}
              />
            </div>
            <FormSelect
              form={form}
              name={"status" as Path<T>}
              label="Status"
              selectItem={STATUS_LIST}
              disabled={type === "Detail"}
            />
          </div>
          {type !== "Detail" && (
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {isLoading ? <Loader2 className="animate-spin" /> : type}
              </Button>
            </DialogFooter>
          )}
        </form>
      </Form>
    </DialogContent>
  );
}
