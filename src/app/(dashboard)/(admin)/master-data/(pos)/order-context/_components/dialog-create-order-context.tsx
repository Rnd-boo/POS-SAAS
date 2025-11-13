import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { INITIAL_STATE_UNIT } from "@/constants/unit.constant";
import {
  INITIAL_ORDER_CONTEXT,
  INITIAL_STATE_ORDER_CONTEXT,
} from "@/constants/pos/order-context";
import {
  OrderContextForm,
  orderContextFormSchema,
} from "@/validations/pos/order-context.validation";
import { useBrandStore } from "@/stores/brand-store";
import { createOrderContext } from "../action";
import FormOrderContext from "./form-order-context";

export default function DialogCreateOrderContext({
  refetch,
}: {
  refetch: () => void;
}) {
  const currentBrandId = useBrandStore((s) => s.currentBrandId);

  const form = useForm<OrderContextForm>({
    resolver: zodResolver(orderContextFormSchema),
    defaultValues: INITIAL_ORDER_CONTEXT,
  });

  const [
    createOrderContextState,
    createOrderContextAction,
    isPendingcreateOrderContext,
  ] = useActionState(createOrderContext, INITIAL_STATE_ORDER_CONTEXT);

  const onSubmit = form.handleSubmit(async (data) => {
    // Debug: Log the form data

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("brand_id", String(currentBrandId));

    startTransition(() => {
      createOrderContextAction(formData);
    });
  });

  useEffect(() => {
    if (createOrderContextState?.status === "error") {
      toast.error("Create OrderContext Failed", {
        description: createOrderContextState.errors?._form?.[0],
      });
    }
    if (createOrderContextState?.status === "success") {
      toast.success("Create OrderContext Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createOrderContextState]);

  return (
    <FormOrderContext
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingcreateOrderContext}
      type="Create"
    />
  );
}
