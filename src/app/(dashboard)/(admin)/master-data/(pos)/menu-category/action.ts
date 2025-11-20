"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { MenuCategoryFormState } from "@/types/pos/menu-category";
import { menuCategorySchema } from "@/validations/pos/menu-category.validation";

export async function createMenuCategory(
  prevState: MenuCategoryFormState,
  formData: FormData
) {
  const validatedFields = menuCategorySchema.safeParse({
    name: formData.get("name"),
    status: formData.get("status") === "true" ? true : false,
    brand_id: Number(formData.get("brand_id")),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const supabase = await createClient();
  const { currentUserId, currentClientId } = await getCurrentProfile();

  const { error } = await supabase.from("menu_category").insert({
    client_profiles_id: currentUserId,
    clients_id: currentClientId,
    name: validatedFields.data.name,
    status: validatedFields.data.status,
    brand_id: validatedFields.data.brand_id,
  });

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}
