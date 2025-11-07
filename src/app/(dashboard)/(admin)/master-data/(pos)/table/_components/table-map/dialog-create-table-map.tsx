import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createTableMap } from "../../action";
import {
  TableMapForm,
  tableMapFormSchema,
} from "@/validations/pos/table.validation";
import {
  INITIAL_STATE_TABLE_MAP,
  INITIAL_TABLE_MAP,
} from "@/constants/pos/table.constant";
import { useBrandStore } from "@/stores/brand-store";
import FormTableMap from "./form-table-map";

export default function DialogCreateTableMap({
  refetch,
}: {
  refetch: () => void;
}) {
  const currentBrandId = useBrandStore((s) => s.currentBrandId);

  const form = useForm<TableMapForm>({
    resolver: zodResolver(tableMapFormSchema),
    defaultValues: INITIAL_TABLE_MAP,
  });

  const [createTableMapState, createTableMapAction, isPendingcreateTableMap] =
    useActionState(createTableMap, INITIAL_STATE_TABLE_MAP);

  const onSubmit = form.handleSubmit(async (data) => {
    // Debug: Log the form data

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createTableMapAction(formData);
    });
  });

  useEffect(() => {
    if (createTableMapState?.status === "error") {
      toast.error("Create TableMap Failed", {
        description: createTableMapState.errors?._form?.[0],
      });
    }
    if (createTableMapState?.status === "success") {
      toast.success("Create TableMap Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createTableMapState]);

  useEffect(() => {
    form.setValue("brand_id", String(currentBrandId));
  });

  return (
    <FormTableMap
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingcreateTableMap}
      type="Create"
    />
  );
}
