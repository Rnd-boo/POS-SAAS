import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { INITIAL_BRAND, INITIAL_STATE_BRAND } from "@/constants/brand.constant";
import { BrandForm, brandFormSchema } from "@/validations/brand-validation";
import { createBrand } from "../action";
import FormBrand from "./form-brand";

export default function DialogCreateBrand({
  refetch,
}: {
  refetch: () => void;
}) {
  const form = useForm<BrandForm>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: INITIAL_BRAND,
  });

  const [createBrandState, createBrandAction, isPendingcreateBrand] =
    useActionState(createBrand, INITIAL_STATE_BRAND);

  const onSubmit = form.handleSubmit(async (data) => {
    // Debug: Log the form data

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createBrandAction(formData);
    });
  });

  useEffect(() => {
    if (createBrandState?.status === "error") {
      toast.error("Create Brand Failed", {
        description: createBrandState.errors?._form?.[0],
      });
    }
    if (createBrandState?.status === "success") {
      toast.success("Create Brand Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createBrandState]);

  return (
    <FormBrand
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingcreateBrand}
      type="Create"
    />
  );
}
