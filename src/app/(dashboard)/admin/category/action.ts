"use server";

import { getProfileFromToken } from "@/actions/auth-action";
import { createClient } from "@/lib/supabase/server";
import { CategoryFormState } from "@/types/category";
import { Profile } from "@/types/profiles";
import { categorySchema } from "@/validations/category-validation";
import { cookies } from "next/headers";

export async function createCategory(
  prevState: CategoryFormState,
  formData: FormData
) {
  const validatedFields = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    is_active: formData.get("is_active") === "true" ? true : false,
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const supabase = await createClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("client_profile")?.value;

  let currentUserId: string | null = null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("client_profile")?.value;

    if (token) {
      const profile = await getProfileFromToken(token);
      currentUserId = profile?.id || null;
    }
  } catch (error) {
    console.log("Custom token method failed:", error);
  }

  const { error } = await supabase.from("category").insert({
    created_by: currentUserId,
    name: validatedFields.data.name,
    description: validatedFields.data.description,
    is_active: validatedFields.data.is_active,
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
