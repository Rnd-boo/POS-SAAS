"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { useBrandStore } from "@/stores/brand-store";
import { BranchFormState } from "@/types/branch";
import { branchSchema } from "@/validations/branch.validation";

export async function createBranch(
  prevState: BranchFormState,
  formData: FormData
) {
  const validatedFields = branchSchema.safeParse({
    name: formData.get("name"),
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

  const { error } = await supabase.from("branch").insert({
    client_profiles_id: currentUserId,
    clients_id: currentClientId,
    name: validatedFields.data.name,
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

export async function updateBranch(
  prevState: BranchFormState,
  formData: FormData
) {
  const validatedFields = branchSchema.safeParse({
    name: formData.get("name"),
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
    .from("branch")
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

export async function deleteBranch(
  prevState: BranchFormState,
  formData: FormData
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("branch")
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
