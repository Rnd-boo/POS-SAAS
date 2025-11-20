import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useBrandStore } from "@/stores/brand-store";
import FormMenuCategory from "./form-menu-category";
import {
  MenuCategoryForm,
  menuCategoryFormSchema,
} from "@/validations/pos/menu-category.validation";
import {
  INITIAL_MENU_CATEGORY,
  INITIAL_STATE_MENU_CATEGORY,
} from "@/constants/pos/menu-category";
import { createMenuCategory } from "../action";

export default function DialogCreateMenuCategory({
  refetch,
}: {
  refetch: () => void;
}) {
  const currentBrandId = useBrandStore((s) => s.currentBrandId);

  const form = useForm<MenuCategoryForm>({
    resolver: zodResolver(menuCategoryFormSchema),
    defaultValues: INITIAL_MENU_CATEGORY,
  });

  const [
    createMenuCategoryState,
    createMenuCategoryAction,
    isPendingcreateMenuCategory,
  ] = useActionState(createMenuCategory, INITIAL_STATE_MENU_CATEGORY);

  const onSubmit = form.handleSubmit(async (data) => {
    // Debug: Log the form data

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append("brand_id", String(currentBrandId));
    startTransition(() => {
      createMenuCategoryAction(formData);
    });
  });

  useEffect(() => {
    if (createMenuCategoryState?.status === "error") {
      toast.error("Create Menu Category Failed", {
        description: createMenuCategoryState.errors?._form?.[0],
      });
    }
    if (createMenuCategoryState?.status === "success") {
      toast.success("Create Menu Category Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createMenuCategoryState]);

  return (
    <FormMenuCategory
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingcreateMenuCategory}
      type="Create"
    />
  );
}
