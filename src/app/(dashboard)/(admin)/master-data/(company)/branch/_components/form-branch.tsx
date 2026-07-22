import FormInput from "@/components/common/form/form-input";
import FormSelect from "@/components/common/form/form-select";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LOCATION_LIST, STATUS_LIST } from "@/constants/general.constant";
import { cn } from "@/lib/utils";
import { BranchForm } from "@/validations/branch.validation";
import { Plus, X } from "lucide-react";
import { Fragment } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

export default function FormBranch({
  form,
  type,
  isLoading,
}: {
  form: UseFormReturn<BranchForm>;
  type: "Detail" | "Create" | "Update";
  isLoading?: boolean;
}) {
  const {
    fields,
    append,
    remove: remove,
  } = useFieldArray({
    control: form.control,
    name: "branch_location",
  });

  const handleAddBranchLocation = () => {
    append({
      name: "",
      type: "",
    });
  };

  return (
    <>
      <div className="gap-4 grid grid-cols-2">
        <FormInput
          form={form}
          name={"name"}
          label="Branch"
          placeholder="Insert Branch name"
          disabled={type === "Detail"}
          isLoading={isLoading}
        />
        <FormSelect
          form={form}
          name={"status"}
          label="Status"
          selectItem={STATUS_LIST}
          disabled={type === "Detail"}
          isLoading={isLoading}
        />
      </div>
      <Separator className="my-4" />
      <div
        className={cn(
          "grid gap-x-2 ",
          type === "Detail"
            ? "grid-cols-[1fr_2fr]"
            : "grid-cols-[1fr_2fr_auto]",
        )}
      >
        <Label>Type</Label>
        <Label>Location Name</Label>
        {type !== "Detail" && <div></div>}
        {fields.map((field, index) => (
          <Fragment key={field.id}>
            <FormSelect
              form={form}
              label=""
              name={`branch_location.${index}.type`}
              selectItem={LOCATION_LIST}
              disabled={type === "Detail"}
              isLoading={isLoading}
            />
            <FormInput
              form={form}
              name={`branch_location.${index}.name`}
              label=""
              placeholder="Insert Location name"
              disabled={type === "Detail"}
              isLoading={isLoading}
            />
            {fields.length > 1 && type !== "Detail" && (
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => remove(index)}
                className="cursor-pointer mt-2"
              >
                <X />
              </Button>
            )}
          </Fragment>
        ))}
      </div>
      {type !== "Detail" && (
        <Button
          type="button"
          onClick={handleAddBranchLocation}
          className="col-start-1 mt-2"
          variant="outline"
        >
          <Plus />
          Add Location
        </Button>
      )}
    </>
  );
}
