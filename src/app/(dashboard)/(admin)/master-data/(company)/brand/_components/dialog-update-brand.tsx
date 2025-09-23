import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import {
  Brand,
  BrandForm,
  brandFormSchema,
} from "@/validations/brand-validation";
import { updateBrand } from "../action";
import { INITIAL_STATE_BRAND } from "@/constants/brand.constant";
import FormBrand from "./form-brand";

export default function DialogUpdateBrand({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: {
  refetch: () => void;
  currentData?: Brand;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<BrandForm>({
    resolver: zodResolver(brandFormSchema),
  });

  const [updateBrandState, updateBrandAction, isPendingUpdateBrand] =
    useActionState(updateBrand, INITIAL_STATE_BRAND);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("id", currentData?.id ?? "");
    startTransition(() => {
      updateBrandAction(formData);
    });
  });

  useEffect(() => {
    if (updateBrandState?.status === "error") {
      toast.error("Update Brand Failed", {
        description: updateBrandState.errors?._form?.[0],
      });
    }
    if (updateBrandState?.status === "success") {
      toast.success("Update Brand Success");
      form.reset();
      handleChangeAction?.(false);
      refetch();
    }
  }, [updateBrandState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name);
      form.setValue("status", currentData.status.toString());
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormBrand
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateBrand}
        type="Update"
      />
    </Dialog>
  );
}
