"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { BillOfMaterialsFormState } from "@/types/products/bill-of-materials";
import { billOfMaterialsFormSchema } from "@/validations/products/bill-of-materials-validation";

export async function createBillOfMaterials(
  prevState: BillOfMaterialsFormState,
  formData: FormData,
) {
  const supabase = await createClient();

  const { currentUserId, currentClientId } = await getCurrentProfile();

  const validatedFields = billOfMaterialsFormSchema.safeParse({
    type: formData.get("type"),
    code: formData.get("code"),
    name: formData.get("name"),
    product_units_id: formData.get("product_units_id"),
    brand_id: formData.get("brand_id"),
    status: formData.get("status"),
    product_bom: JSON.parse(formData.get("product_bom") as string),
  });
  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const { data: BOMData, error: BOMError } = await supabase
    .from("bill_of_materials")
    .insert({
      client_profiles_id: currentUserId,
      clients_id: currentClientId,
      type: validatedFields.data.type,
      code: validatedFields.data.code,
      name: validatedFields.data.name,
      product_units_id: validatedFields.data.product_units_id,
      brand_id: validatedFields.data.brand_id,
      status: validatedFields.data.status,
    })
    .select("id")
    .single();

  if (BOMError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [BOMError.message],
      },
    };
  }

  const productBOMData = validatedFields.data.product_bom.map((bom) => ({
    clients_id: currentClientId,
    client_profiles_id: currentUserId,
    bill_of_materials: BOMData.id,
    product_units_id: bom.product_units_id,
    qty: bom.qty,
    waste: bom.waste,
  }));

  const { error: productBOMDataError } = await supabase
    .from("product_bill_of_materials")
    .insert(productBOMData);

  if (productBOMDataError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [productBOMDataError.message],
      },
    };
  }
  return {
    status: "success",
  };
}

export async function updateBillOfMaterials(
  prevState: BillOfMaterialsFormState,
  formData: FormData,
) {
  const { currentUserId, currentClientId } = await getCurrentProfile();
  const supabase = await createClient();

  const validatedFields = billOfMaterialsFormSchema.safeParse({
    type: formData.get("type"),
    code: formData.get("code"),
    name: formData.get("name"),
    product_units_id: formData.get("product_units_id"),
    brand_id: formData.get("brand_id"),
    status: formData.get("status"),
    product_bom: JSON.parse(formData.get("product_bom") as string),
  });
  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const { data: BOMData, error: BOMError } = await supabase
    .from("bill_of_materials")
    .update({
      type: validatedFields.data.type,
      code: validatedFields.data.code,
      name: validatedFields.data.name,
      product_units_id: validatedFields.data.product_units_id,
      status: validatedFields.data.status,
    })
    .eq("id", formData.get("id"))
    .select("id")
    .single();

  if (BOMError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [BOMError.message],
      },
    };
  }

  const { error: deleteProductBOMError } = await supabase
    .from("product_bill_of_materials")
    .delete()
    .eq("bill_of_materials", BOMData.id);

  if (deleteProductBOMError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [deleteProductBOMError.message],
      },
    };
  }

  const productBOMData = validatedFields.data.product_bom.map((bom) => ({
    clients_id: currentClientId,
    client_profiles_id: currentUserId,
    bill_of_materials: BOMData.id,
    product_units_id: bom.product_units_id,
    qty: bom.qty,
    waste: bom.waste,
  }));

  const { error: productBOMDataError } = await supabase
    .from("product_bill_of_materials")
    .insert(productBOMData);

  if (productBOMDataError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [productBOMDataError.message],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function deleteBillOfMaterials(
  prevState: BillOfMaterialsFormState,
  formData: FormData,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bill_of_materials")
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
