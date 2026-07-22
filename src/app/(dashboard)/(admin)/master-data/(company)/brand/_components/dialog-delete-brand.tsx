import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import DialogDelete from "@/components/common/dialog/dialog-delete";
import { deleteBrand } from "../action";
import { INITIAL_STATE_BRAND } from "@/constants/brand.constant";
import { Brand } from "@/validations/brand-validation";

export default function DialogDeleteBrand({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Brand;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteBrandState, deleteBrandAction, isPendingDeleteBrand] =
    useActionState(deleteBrand, INITIAL_STATE_BRAND);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteBrandAction(formData);
    });
  };

  useEffect(() => {
    if (deleteBrandState?.status === "error") {
      toast.error("Delete Brand Failed", {
        description: deleteBrandState.errors?._form?.[0],
      });
    }
    if (deleteBrandState?.status === "success") {
      toast.success("Delete Brand Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteBrandState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteBrand}
      onSubmit={onSubmit}
      title="Brand"
    />
  );
}
