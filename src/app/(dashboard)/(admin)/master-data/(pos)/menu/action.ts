'use server'

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { MenuFormState } from "@/types/pos/menu";
import { menuFormSchema } from "@/validations/pos/menu.validation";

export async function createMenu(
  prevState: MenuFormState,
  formData: FormData
) {
  const validatedFields = menuFormSchema.safeParse({
    name: formData.get("name"),
    status: formData.get("status"),
    menu_category_id: formData.get("menu_category_id"),
    products_id: formData.get("products_id"),
    brand_id: formData.get("brand_id"),
  });
  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const supabase = await createClient();

  const { currentUserId, currentClientId } = await getCurrentProfile();

  const { error } = await supabase
    .from("menu")
    .insert({
      client_profiles_id: currentUserId,
      clients_id: currentClientId,
      name: validatedFields.data.name,
      brand_id: validatedFields.data.brand_id,
      products_id: validatedFields.data.products_id,
      menu_category_id: validatedFields.data.menu_category_id,
      status: validatedFields.data.status,
    })
    .select("id")
    .single();

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