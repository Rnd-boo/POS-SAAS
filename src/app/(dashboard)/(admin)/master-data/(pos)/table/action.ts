"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { TableMapFormState } from "@/types/(pos)/table-map";
import { tableMapSchema } from "@/validations/(pos)/table-map.validation";

export async function createTableMap(
  prevState: TableMapFormState,
  formData: FormData
) {
  const validatedFields = tableMapSchema.safeParse({
    name: formData.get("name"),
    branch_id: formData.get("branch_id"),
    brand_id: Number(formData.get("brand_id")),
    status: formData.get("status") === "true" ? true : false,
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const supabase = await createClient();

  const { currentUserId, currentClientId } = await getCurrentProfile();

  const { error } = await supabase.from("table_map").insert({
    client_profiles_id: currentUserId,
    clients_id: currentClientId,
    name: validatedFields.data.name,
    branch_id: validatedFields.data.branch_id,
    brand_id: validatedFields.data.brand_id,
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

export async function updateTableMap(
  prevState: TableMapFormState,
  formData: FormData
) {
  const validatedFields = tableMapSchema.safeParse({
    name: formData.get("name"),
    branch_id: formData.get("branch_id"),
    brand_id: formData.get("brand_id"),
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
    .from("table_map")
    .update({
      name: validatedFields.data.name,
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

export async function deleteTableMap(
  prevState: TableMapFormState,
  formData: FormData
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("table_map")
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
