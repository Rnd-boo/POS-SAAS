"use server";

import { getProfileFromToken } from "@/actions/auth-action";
import { createClient } from "@/lib/supabase/server";
import { UnitFormState } from "@/types/unit";
import { unitSchema } from "@/validations/unit-validation";
import { cookies } from "next/headers";

export async function createUnit(prevState: UnitFormState, formData: FormData) {
  const validatedFields = unitSchema.safeParse({
    name: formData.get("name"),
    notes: formData.get("notes"),
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

  const { error } = await supabase.from("units").insert({
    created_by: currentUserId,
    name: validatedFields.data.name,
    notes: validatedFields.data.notes,
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

export async function updateUnit(prevState: UnitFormState, formData: FormData) {
  const validatedFields = unitSchema.safeParse({
    name: formData.get("name"),
    notes: formData.get("notes"),
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
    .from("units")
    .update({
      name: validatedFields.data.name,
      notes: validatedFields.data.notes,
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

export async function deleteUnit(prevState: UnitFormState, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("units")
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
