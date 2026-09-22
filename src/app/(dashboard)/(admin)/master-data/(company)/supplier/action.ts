"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { SupplierFormState } from "@/types/supplier";
import { supplierPIC, supplierSchema } from "@/validations/supplier-validation";

function parseSupplier(formData: FormData) {
  return supplierSchema.safeParse({
    name: formData.get("name"),
    brand_id: Number(formData.get("brand_id")),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    country: formData.get("country"),
    phone: formData.get("phone"),
    status: formData.get("status") === "true",
    payment_method: formData.get("payment_method"),
    credit_terms: Number(formData.get("credit_terms")),
    bank_name: formData.get("bank_name"),
    bank_account_number: formData.get("bank_account_number"),
    bank_account_name: formData.get("bank_account_name"),
  });
}

function parsePICs(formData: FormData): { data?: ReturnType<typeof supplierPIC.parse>[]; error?: string } {
  const value = formData.get("supplier_PIC");
  if (typeof value !== "string") return { data: [] };
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return { error: "Supplier PIC data is invalid" };
  }
  if (!Array.isArray(parsed)) return { error: "Supplier PIC data is invalid" };
  const results = parsed.map((pic) => supplierPIC.safeParse(pic));
  const invalid = results.find((result) => !result.success);
  if (invalid && !invalid.success) return { error: "Supplier PIC data is invalid" };
  return { data: results.flatMap((result) => result.success ? [result.data] : []) };
}

export async function createSupplier(
  prevState: SupplierFormState,
  formData: FormData,
) {
  const validatedFields = parseSupplier(formData);
  if (!validatedFields.success) {
    return { status: "error", errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] } };
  }

  const supabase = await createClient();
  const { currentUserId, currentClientId } = await getCurrentProfile();
  const { data, error } = await supabase
    .from("supplier")
    .insert({ ...validatedFields.data, client_profiles_id: currentUserId, clients_id: currentClientId })
    .select("id")
    .single();

  if (error || !data) {
    return { status: "error", errors: { ...prevState.errors, _form: [error?.message ?? "Supplier was not created"] } };
  }

  const parsedPics = parsePICs(formData);
  if (parsedPics.error) return { status: "error", errors: { ...prevState.errors, _form: [parsedPics.error] } };
  const pics = parsedPics.data ?? [];
  if (pics.length) {
    const { error: picError } = await supabase
      .from("supplier_pic")
      .insert(pics.map((pic) => ({ ...pic, supplier_id: data.id })));
    if (picError) return { status: "error", errors: { ...prevState.errors, _form: [picError.message] } };
  }
  return { status: "success" };
}

export async function updateSupplier(
  prevState: SupplierFormState,
  formData: FormData,
) {
  const validatedFields = parseSupplier(formData);
  if (!validatedFields.success) {
    return { status: "error", errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] } };
  }

  const supabase = await createClient();
  const id = formData.get("id");
  const { error } = await supabase.from("supplier").update(validatedFields.data).eq("id", id);
  if (error) return { status: "error", errors: { ...prevState.errors, _form: [error.message] } };

  const { error: deletePicError } = await supabase.from("supplier_pic").delete().eq("supplier_id", id);
  if (deletePicError) return { status: "error", errors: { ...prevState.errors, _form: [deletePicError.message] } };
  const parsedPics = parsePICs(formData);
  if (parsedPics.error) return { status: "error", errors: { ...prevState.errors, _form: [parsedPics.error] } };
  const pics = parsedPics.data ?? [];
  if (pics.length) {
    const { error: picError } = await supabase
      .from("supplier_pic")
      .insert(pics.map((pic) => ({ ...pic, supplier_id: id })));
    if (picError) return { status: "error", errors: { ...prevState.errors, _form: [picError.message] } };
  }
  return { status: "success" };
}

export async function deleteSupplier(
  prevState: SupplierFormState,
  formData: FormData,
) {
  const supabase = await createClient();
  const { error } = await supabase.from("supplier").delete().eq("id", formData.get("id"));
  if (error) return { status: "error", errors: { ...prevState.errors, _form: [error.message] } };
  return { status: "success" };
}
