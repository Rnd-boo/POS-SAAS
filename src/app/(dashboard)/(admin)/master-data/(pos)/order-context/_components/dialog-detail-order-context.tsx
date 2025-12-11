import { useForm } from "react-hook-form";

import { Dialog } from "@/components/ui/dialog";
import FormOrderContext from "./form-order-context";
import {
  OrderContext,
  OrderContextForm,
  orderContextFormSchema,
} from "@/validations/pos/order-context.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

export default function DialogDetailOrderContext({
  currentData,
  handleChangeAction,
  open,
}: {
  currentData?: OrderContext;
  open?: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const form = useForm<OrderContextForm>({
    resolver: zodResolver(orderContextFormSchema),
  });

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
      <FormOrderContext form={form} type="Detail" />
    </Dialog>
  );
}
