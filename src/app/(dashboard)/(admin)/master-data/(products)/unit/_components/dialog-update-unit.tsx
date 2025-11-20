import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { updateUnit } from "../action";

import { Unit, UnitForm, unitFormSchema } from "@/validations/unit-validation";
import { INITIAL_STATE_UNIT } from "@/constants/unit.constant";
import FormUnit from "./form-unit";

export default function DialogUpdateUnit({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: {
  refetch: () => void;
  currentData?: Unit;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<UnitForm>({
    resolver: zodResolver(unitFormSchema),
  });

  const [updateUnitState, updateUnitAction, isPendingUpdateUnit] =
    useActionState(updateUnit, INITIAL_STATE_UNIT);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("id", currentData?.id ?? "");
    startTransition(() => {
      updateUnitAction(formData);
    });
  });

  useEffect(() => {
    if (updateUnitState?.status === "error") {
      toast.error("Update Unit Failed", {
        description: updateUnitState.errors?._form?.[0],
      });
    }
    if (updateUnitState?.status === "success") {
      toast.success("Update Unit Success");
      form.reset();
      handleChangeAction?.(false);
      refetch();
    }
  }, [updateUnitState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name);
      form.setValue("notes", currentData.notes);
      form.setValue("status", String(currentData.status));
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormUnit
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateUnit}
        type="Update"
      />
    </Dialog>
  );
}
