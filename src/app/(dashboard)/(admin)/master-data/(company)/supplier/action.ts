"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { SupplierFormState } from "@/types/supplier";
import { supplierFormSchema } from "@/validations/supplier-validation";

const parseField = (formData: FormData) =>
  supplierFormSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    country: formData.get("country"),
    phone: formData.get("phone"),
    status: formData.get("status"),
    payment_method: formData.get("payment_method"),
    credit_terms: formData.get("credit_terms"),
    bank_name: formData.get("bank_name"),
    bank_account_number: formData.get("bank_account_number"),
    bank_account_name: formData.get("bank_account_name"),
    supplier_PIC: JSON.parse(formData.get("supplier_PIC") as string),
    notes: formData.get("notes"),
  });

const { currentUserId, currentClientId } = await getCurrentProfile();
export async function createSupplier(
  prevState: SupplierFormState,
  formData: FormData,
) {
  const validatedFields = parseField(formData);
  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const { supplier_PIC, ...supplierData } = validatedFields.data;
  const supplierPayload = {
    ...supplierData,
    brand_id: Number(formData.get("brand_id") ?? 0),
    status: supplierData.status === "true",
    credit_terms: Number(supplierData.credit_terms),
  };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .insert({
      ...supplierPayload,
      client_profiles_id: currentUserId,
      clients_id: currentClientId,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error?.message ?? "Supplier was not created"],
      },
    };
  }

  const picData = supplier_PIC ?? [];
  if (picData.length) {
    const { error: picError } = await supabase.from("supplier_pic").insert(
      picData.map((pic) => ({
        ...pic,
        supplier_id: data.id,
        clients_id: currentClientId,
      })),
    );
    if (picError)
      return {
        status: "error",
        errors: { ...prevState.errors, _form: [picError.message] },
      };
  }
  return { status: "success" };
}

export async function updateSupplier(
  prevState: SupplierFormState,
  formData: FormData,
) {
  const validatedFields = parseField(formData);
  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }
  const { supplier_PIC, ...supplierData } = validatedFields.data;
  const supplierPayload = {
    ...supplierData,
    status: supplierData.status === "true",
    credit_terms: Number(supplierData.credit_terms),
  };

  const supabase = await createClient();
  const id = formData.get("id");
  const { error } = await supabase
    .from("suppliers")
    .update(supplierPayload)
    .eq("id", id);
  if (error)
    return {
      status: "error",
      errors: { ...prevState.errors, _form: [error.message] },
    };

  const { error: deletePicError } = await supabase
    .from("supplier_pic")
    .delete()
    .eq("supplier_id", id);
  if (deletePicError)
    return {
      status: "error",
      errors: { ...prevState.errors, _form: [deletePicError.message] },
    };

  const picData = supplier_PIC ?? [];
  if (picData.length) {
    const { error: picError } = await supabase.from("supplier_pic").insert(
      picData.map((pic) => ({
        ...pic,
        supplier_id: id,
        clients_id: currentClientId,
      })),
    );
    if (picError)
      return {
        status: "error",
        errors: { ...prevState.errors, _form: [picError.message] },
      };
  }
  return { status: "success" };
}

export async function deleteSupplier(
  prevState: SupplierFormState,
  formData: FormData,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("id", formData.get("id"));
  if (error)
    return {
      status: "error",
      errors: { ...prevState.errors, _form: [error.message] },
    };
  return { status: "success" };
}
