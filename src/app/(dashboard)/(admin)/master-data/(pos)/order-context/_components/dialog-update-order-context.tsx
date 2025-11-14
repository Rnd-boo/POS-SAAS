import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";

import {
  OrderContext,
  OrderContextForm,
  orderContextFormSchema,
} from "@/validations/pos/order-context.validation";
import { INITIAL_STATE_ORDER_CONTEXT } from "@/constants/pos/order-context";
import FormOrderContext from "./form-order-context";
import { updateOrderContext } from "../action";
import { useBrandStore } from "@/stores/brand-store";

export default function DialogUpdateOrderContext({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: {
  refetch: () => void;
  currentData?: OrderContext;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const currentBrandId = useBrandStore((s) => s.currentBrandId);

  const form = useForm<OrderContextForm>({
    resolver: zodResolver(orderContextFormSchema),
  });

  const [
    updateOrderContextState,
    updateOrderContextAction,
    isPendingUpdateOrderContext,
  ] = useActionState(updateOrderContext, INITIAL_STATE_ORDER_CONTEXT);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append("brand_id", String(currentBrandId));
    formData.append("id", currentData?.id ?? "");
    startTransition(() => {
      updateOrderContextAction(formData);
    });
  });

  useEffect(() => {
    if (updateOrderContextState?.status === "error") {
      toast.error("Update OrderContext Failed", {
        description: updateOrderContextState.errors?._form?.[0],
      });
    }
    if (updateOrderContextState?.status === "success") {
      toast.success("Update OrderContext Success");
      form.reset();
      handleChangeAction?.(false);
      refetch();
    }
  }, [updateOrderContextState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name);
      form.setValue("tax_value", String(currentData.tax_value));
      form.setValue("tax_name", currentData.tax_name);
      form.setValue("other_tax_value", String(currentData.other_tax_value));
      form.setValue("other_tax_name", currentData.other_tax_name);
      form.setValue("status", currentData.status.toString());
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormOrderContext
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateOrderContext}
        type="Update"
      />
    </Dialog>
  );
}
