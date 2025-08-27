"use server";

import { getProfileFromToken } from "@/actions/auth-action";
import { createClient } from "@/lib/supabase/server";
import { CategoryFormState } from "@/types/category";
import { categorySchema } from "@/validations/category-validation";
import { cookies } from "next/headers";

export async function createCategory(
  prevState: CategoryFormState,
  formData: FormData
) {
  const validatedFields = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status") === "true" ? true : false,
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const supabase = await createClient();

  let currentUserId: string | null = null;
  let currentClientId: string | null = null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("client_profile")?.value;

    if (token) {
      const profile = await getProfileFromToken(token);
      currentUserId = profile?.id || null;
      currentClientId = profile?.clients || null;
    }
  } catch (error) {
    console.log("Custom token method failed:", error);
  }

  const { error } = await supabase.from("categories").insert({
    client_profiles_id: currentUserId,
    clients_id: currentClientId,
    name: validatedFields.data.name,
    description: validatedFields.data.description,
    status: validatedFields.data.status,
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

export async function updateCategory(
  prevState: CategoryFormState,
  formData: FormData
) {
  const validatedFields = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status") === "true" ? true : false,
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      status: validatedFields.data.status,
    })
    .eq("id", formData.get("id"));

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

export async function deleteCategory(
  prevState: CategoryFormState,
  formData: FormData
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", formData.get("id"));

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return { status: "success" };
}
