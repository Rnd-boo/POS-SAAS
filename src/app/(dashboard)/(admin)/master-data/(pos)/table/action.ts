"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { TableLayoutFormState, TableMapFormState } from "@/types/pos/table";
import {
  tableLayoutFormSchema,
  tableLayoutSchema,
  tableMapSchema,
} from "@/validations/pos/table.validation";

export async function createTableMap(
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

export async function tablesAction(
  prevState: TableLayoutFormState,
  formData: FormData
) {
  const validatedFields = tableLayoutFormSchema.safeParse({
    tables: JSON.parse(formData.get("tables") as string),
  });
  const table_map = formData.get("table_map_id");
  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }
  const supabase = await createClient();
  const { tables } = validatedFields.data;
  // Delete all existing units for this product
  const { error: deleteError } = await supabase
    .from("table")
    .delete()
    .eq("table_map_id", table_map);

  if (deleteError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [deleteError.message],
      },
    };
  }
  const { currentUserId, currentClientId } = await getCurrentProfile();

  // Insert new units (only if there are units to insert)
  if (tables.length > 0) {
    const tablesToInsert = tables.map((table) => ({
      ...table,
      table_map_id: table_map,
      client_profiles_id: currentUserId,
      clients_id: currentClientId,
    }));
    const { error: insertError } = await supabase
      .from("table")
      .insert(tablesToInsert);

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
