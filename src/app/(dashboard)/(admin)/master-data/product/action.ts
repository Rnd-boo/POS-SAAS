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

  const validatedProductFields = productSchema.safeParse({
    name: formData.get("name"),
    categories_id: formData.get("categories_id"),
    upc: formData.get("upc"),
    description: formData.get("description"),
    status: formData.get("status") === "true" ? true : false,
    units: JSON.parse(formData.get("units") as string),
  });

  if (!validatedProductFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedProductFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const { data: insertedProduct, error: productError } = await supabase
    .from("products")
    .insert({
      client_profiles_id: currentUserId,
      clients_id: currentClientId,
      name: validatedProductFields.data.name,
      description: validatedProductFields.data.description,
      upc: validatedProductFields.data.upc,
      categories_id: validatedProductFields.data.categories_id,
      status: validatedProductFields.data.status,
    })
    .select()
    .single();

  if (productError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [productError.message],
      },
    };
  }

  const productUnitsData = validatedProductFields.data.units.map(
    (unit, index) => ({
      clients_id: currentClientId,
      products_id: insertedProduct.id,
      units_id: parseInt(unit.units_id),
      conversion_factor: parseFloat(unit.conversion_factor),
      is_base_unit: index === 0, // First unit is base unit
    })
  );

  const { error: unitError } = await supabase
    .from("product_units")
    .insert(productUnitsData);

  if (unitError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [unitError.message],
      },
    };
  }
  return {
    status: "success",
  };
}

// export async function updateProduct(
//   prevState: ProductFormState,
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

export async function deleteProduct(
  prevState: ProductFormState,
  formData: FormData
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
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
