import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableForm,
  tableMapFormSchema,
} from "@/validations/(pos)/table-map.validation";
import { INITIAL_STATE_TABLE_MAP } from "@/constants/(pos)/table-map.constant";
import { updateTableMap } from "../../action";
import FormTableMap from "./form-table-map";

export default function DialogUpdateTableMap({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: {
  refetch: () => void;
  currentData?: Table;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<TableForm>({
    resolver: zodResolver(tableMapFormSchema),
  });

  const [updateTableMapState, updateTableMapAction, isPendingUpdateTableMap] =
    useActionState(updateTableMap, INITIAL_STATE_TABLE_MAP);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("id", currentData?.id ?? "");
    startTransition(() => {
      updateTableMapAction(formData);
    });
  });

  useEffect(() => {
    if (updateTableMapState?.status === "error") {
      toast.error("Update TableMap Failed", {
        description: updateTableMapState.errors?._form?.[0],
      });
    }
    if (updateTableMapState?.status === "success") {
      toast.success("Update TableMap Success");
      form.reset();
      handleChangeAction?.(false);
      refetch();
    }
  }, [updateTableMapState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name);
      form.setValue("branch_id", currentData.branch_id.toString());
      form.setValue("brand_id", currentData.brand_id.toString());
      form.setValue("status", currentData.status.toString());
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormTableMap
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateTableMap}
        type="Update"
      />
    </Dialog>
  );
}
