import FormInput from "@/components/common/form/form-input";
import FormSelect from "@/components/common/form/form-select";
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

export default function FormMenuCategory<T extends FieldValues>({
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
          <DialogTitle>{type} Menu Category</DialogTitle>
          {type !== "Detail" && (
            <DialogDescription>
              {type === "Create"
                ? "Add a new Menu Category"
                : "Make a changes this Menu Category"}
            </DialogDescription>
          )}
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 ">
          <div className="space-y-4 max-h-[50vh] overflow-y-auto px-1">
            <FormInput
              form={form}
              name={"name" as Path<T>}
              label="Menu Category"
              placeholder="Insert Menu Category name"
              disabled={type === "Detail"}
            />
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
