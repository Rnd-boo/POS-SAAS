import {
  UnitForm,
  unitFormSchema,
} from "@/validations/products/unit-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUnit } from "../action";
import {
  INITIAL_STATE_UNIT,
  INITIAL_UNIT,
} from "@/constants/products/unit.constant";
import FormUnit from "./form-unit";
import { useBrandStore } from "@/stores/brand-store";

export default function DialogCreateUnit({ refetch }: { refetch: () => void }) {
  const currentBrandId = useBrandStore((state) => state.currentBrandId);

  const form = useForm<UnitForm>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: INITIAL_UNIT,
  });

  const [createUnitState, createUnitAction, isPendingcreateUnit] =
    useActionState(createUnit, INITIAL_STATE_UNIT);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (currentBrandId) {
      formData.append("brand_id", currentBrandId);
    }

    startTransition(() => {
      createUnitAction(formData);
    });
  });

  useEffect(() => {
    if (createUnitState?.status === "error") {
      toast.error("Create Unit Failed", {
        description: createUnitState.errors?._form?.[0],
      });
    }
    if (createUnitState?.status === "success") {
      toast.success("Create Unit Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createUnitState]);

  return (
    <FormUnit
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingcreateUnit}
      type="Create"
    />
  );
}
