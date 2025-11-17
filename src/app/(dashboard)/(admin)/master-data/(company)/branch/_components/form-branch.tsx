import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LOCATION_LIST, STATUS_LIST } from "@/constants/general.constant";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { BranchForm } from "@/validations/branch.validation";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { FormEvent, Fragment } from "react";
import {
  ArrayPath,
  FieldValues,
  Path,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";

export default function FormBranch({
  form,
}: {
  form: UseFormReturn<BranchForm>;
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
        />
        <FormSelect
          form={form}
          name={"status"}
          label="Status"
          selectItem={STATUS_LIST}
        />
      </div>
      <Separator className="my-4" />
      <div className="grid grid-cols-[1fr_2fr_auto] gap-x-2">
        <Label>Type</Label>
        <Label>Location Name</Label>
        <div></div>
        {fields.map((field, index) => (
          <Fragment key={field.id}>
            <FormSelect
              form={form}
              label=""
              name={`branch_location.${index}.type`}
              selectItem={LOCATION_LIST}
            />
            <FormInput
              form={form}
              name={`branch_location.${index}.name`}
              label=""
              placeholder="Insert Location name"
            />
            {fields.length > 1 && (
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
      <Button
        type="button"
        onClick={handleAddBranchLocation}
        className="col-start-1 mt-2"
        variant="outline"
      >
        <Plus />
        Add Location
      </Button>
    </>
  );
}
