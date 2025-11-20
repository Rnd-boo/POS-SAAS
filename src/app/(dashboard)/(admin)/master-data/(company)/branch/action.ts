"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { BranchFormState } from "@/types/branch";
import {
  branchFormSchema,
  branchSchema,
} from "@/validations/branch.validation";

export async function createBranch(
  prevState: BranchFormState,
  formData: FormData
) {
  const validatedFields = branchFormSchema.safeParse({
    name: formData.get("name"),
    brand_id: Number(formData.get("brand_id")),
    status: formData.get("status"),
    branch_location: JSON.parse(formData.get("branch_location") as string),
    branch_order_context: JSON.parse(
      formData.get("branch_order_context") as string
    ),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const supabase = await createClient();

  const { currentUserId, currentClientId } = await getCurrentProfile();

  const { data: branchData, error: branchError } = await supabase
    .from("branch")
    .insert({
      client_profiles_id: currentUserId,
      clients_id: currentClientId,
      name: validatedFields.data.name,
      brand_id: validatedFields.data.brand_id,
      status: validatedFields.data.status,
    })
    .select("id")
    .single();

  if (branchError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [branchError.message],
      },
    };
  }
  const branchLocationData = validatedFields.data.branch_location.map(
    (location) => ({
      clients_id: currentClientId,
      client_profiles_id: currentUserId,
      branch_id: branchData.id,
      name: location.name,
      type: location.type,
    })
  );
  const { error: branchLocationError } = await supabase
    .from("branch_location")
    .insert(branchLocationData);

  if (branchLocationError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [branchLocationError.message],
      },
    };
  }

  const branchOrderContextData = validatedFields.data.branch_order_context.map(
    (order_context) => ({
      clients_id: currentClientId,
      client_profiles_id: currentUserId,
      branch_id: branchData.id,
      order_context_id: order_context.order_context,
    })
  );
  const { error: branchOrderContextError } = await supabase
    .from("branch_order_context")
    .insert(branchOrderContextData);

  if (branchOrderContextError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [branchOrderContextError.message],
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
  const validatedFields = branchFormSchema.safeParse({
    name: formData.get("name"),
    brand_id: Number(formData.get("brand_id")),
    status: formData.get("status"),
    branch_location: JSON.parse(formData.get("branch_location") as string),
    branch_order_context: JSON.parse(
      formData.get("branch_order_context") as string
    ),
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

  const { data: branchData, error } = await supabase
    .from("branch")
    .update({
      name: validatedFields.data.name,
      status: validatedFields.data.status,
    })
    .eq("id", formData.get("id"))
    .select()
    .single();

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }
  const { currentUserId, currentClientId } = await getCurrentProfile();

  const branchLocationData = validatedFields.data.branch_location.map(
    (location) => ({
      clients_id: currentClientId,
      client_profiles_id: currentUserId,
      branch_id: branchData.id,
      name: location.name,
      type: location.type,
    })
  );

  const { error: deleteErrorBranchLocation } = await supabase
    .from("branch_location")
    .delete()
    .eq("branch_id", branchData.id);

  if (deleteErrorBranchLocation) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [deleteErrorBranchLocation.message],
      },
    };
  }

  const { error: insertBranchLocationError } = await supabase
    .from("branch_location")
    .insert(branchLocationData);

  if (insertBranchLocationError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [insertBranchLocationError.message],
      },
    };
  }

  const branchOrderContextData = validatedFields.data.branch_order_context.map(
    (order_context) => ({
      clients_id: currentClientId,
      client_profiles_id: currentUserId,
      branch_id: branchData.id,
      order_context_id: order_context.order_context,
    })
  );

  const { error: deleteErrorOrderContext } = await supabase
    .from("branch_order_context")
    .delete()
    .eq("branch_id", branchData.id);

  if (deleteErrorOrderContext) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [deleteErrorOrderContext.message],
      },
    };
  }

  const { error: insertOrderContextError } = await supabase
    .from("branch_order_context")
    .insert(branchOrderContextData);

  if (insertOrderContextError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [insertOrderContextError.message],
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
