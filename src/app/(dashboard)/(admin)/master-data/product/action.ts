"use server";

import { getProfileFromToken } from "@/actions/auth-action";
import { createClient } from "@/lib/supabase/server";
import { ProductFormState } from "@/types/product";
import { productSchema } from "@/validations/product-validation";
import { cookies } from "next/headers";

export async function createProduct(
  prevState: ProductFormState,
  formData: FormData
) {
  const validatedFields = productSchema.safeParse({
    name: formData.get("name"),
    categories_id: formData.get("categories_id"),
    upc: formData.get("upc"),
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

  const { error } = await supabase.from("products").insert({
    client_profiles_id: currentUserId,
    clients_id: currentClientId,
    name: validatedFields.data.name,
    description: validatedFields.data.description,
    upc: validatedFields.data.upc,
    categories_id: validatedFields.data.categories_id,
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

// export async function updateProduct(
//   prevState: CategoryFormState,
//   formData: FormData
// ) {
//   const validatedFields = categorySchema.safeParse({
//     name: formData.get("name"),
//     description: formData.get("description"),
//     is_active: formData.get("is_active") === "true" ? true : false,
//   });

//   if (!validatedFields.success) {
//     return {
//       status: "error",
//       errors: {
//         ...validatedFields.error.flatten().fieldErrors,
//         _form: [],
//       },
//     };
//   }

//   const supabase = await createClient();

//   const { error } = await supabase
//     .from("categories")
//     .update({
//       name: validatedFields.data.name,
//       description: validatedFields.data.description,
//       is_active: validatedFields.data.is_active,
//     })
//     .eq("id", formData.get("id"));

//   if (error) {
//     return {
//       status: "error",
//       errors: {
//         ...prevState.errors,
//         _form: [error.message],
//       },
//     };
//   }

//   return {
//     status: "success",
//   };
// }

// export async function deleteCategory(
//   prevState: CategoryFormState,
//   formData: FormData
// ) {
//   const supabase = await createClient();

//   const { error } = await supabase
//     .from("categories")
//     .delete()
//     .eq("id", formData.get("id"));

//   if (error) {
//     return {
//       status: "error",
//       errors: {
//         ...prevState.errors,
//         _form: [error.message],
//       },
//     };
//   }

//   return { status: "success" };
// }
