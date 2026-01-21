"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { ProductFormState } from "@/types/products/product";
import { productSchema } from "@/validations/products/product-validation";

export async function createProduct(
  prevState: ProductFormState,
  formData: FormData,
) {
  const supabase = await createClient();
  const { currentUserId, currentClientId } = await getCurrentProfile();

  const validatedProductFields = productSchema.safeParse({
    name: formData.get("name"),
    categories_id: formData.get("categories_id"),
    upc: formData.get("upc"),
    description: formData.get("description"),
    status: formData.get("status") === "true" ? true : false,
    brand_id: Number(formData.get("brand_id")),
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
      brand_id: validatedProductFields.data.brand_id,
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

  const productUnitsData = (validatedProductFields?.data?.units ?? []).map(
    (unit, index) => ({
      clients_id: currentClientId,
      products_id: insertedProduct.id,
      brand_id: Number(unit.brand_id),
      units_id: parseInt(unit.units_id),
      conversion_factor: parseFloat(unit.conversion_factor),
      is_base_unit: index === 0,
      is_sales_unit: unit.is_sales_unit,
    }),
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

export async function updateProduct(
  prevState: ProductFormState,
  formData: FormData,
) {
  const supabase = await createClient();

  const { currentClientId } = await getCurrentProfile();

  const productId = formData.get("id") as string;
  if (!productId || productId === "null" || productId === "undefined") {
    return {
      status: "error",
      errors: {
        _form: ["Product ID is required"],
      },
    };
  }
  const validatedProductFields = productSchema.safeParse({
    name: formData.get("name"),
    categories_id: formData.get("categories_id"),
    upc: formData.get("upc"),
    description: formData.get("description"),
    status: formData.get("status") === "true" ? true : false,
    brand_id: Number(formData.get("brand_id")),
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

  const { data: updatedProduct, error: productError } = await supabase
    .from("products")
    .update({
      name: validatedProductFields.data.name,
      description: validatedProductFields.data.description,
      upc: validatedProductFields.data.upc,
      categories_id: validatedProductFields.data.categories_id,
      status: validatedProductFields.data.status,
    })
    .eq("id", productId)
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

  const productUnitsData = (validatedProductFields?.data?.units ?? []).map(
    (unit, index) => ({
      clients_id: currentClientId,
      products_id: updatedProduct.id,
      brand_id: Number(unit.brand_id),
      units_id: parseInt(unit.units_id),
      conversion_factor: parseFloat(unit.conversion_factor),
      is_base_unit: index === 0, // First unit is base unit
      is_sales_unit: unit.is_sales_unit,
    }),
  );

  // Delete all existing units for this product
  const { error: deleteError } = await supabase
    .from("product_units")
    .delete()
    .eq("products_id", updatedProduct.id);

  if (deleteError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [deleteError.message],
      },
    };
  }

  // Insert new units (only if there are units to insert)
  if (productUnitsData.length > 0) {
    const { error: insertError } = await supabase
      .from("product_units")
      .insert(productUnitsData);

    if (insertError) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [insertError.message],
        },
      };
    }
  }
  return {
    status: "success",
  };
}

export async function deleteProduct(
  prevState: ProductFormState,
  formData: FormData,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", formData.get("id") as string);

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
