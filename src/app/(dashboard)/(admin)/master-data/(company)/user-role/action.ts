"use server";
import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { UserRoleFormState } from "@/types/user-role";
import { roleFormSchema } from "@/validations/role.validation";

export async function createUserRole(
  prevState: UserRoleFormState,
  formData: FormData,
) {
  const validatedFields = roleFormSchema.safeParse({
    name: formData.get("name"),
    brand_id: Number(formData.get("brand_id")),
    role_permissions: JSON.parse(formData.get("role_permissions") as string),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const supabase = await createClient();

  const { currentUserId, currentClientId } = await getCurrentProfile();

  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .insert({
      client_profiles_id: currentUserId,
      clients_id: currentClientId,
      name: validatedFields.data.name,
      brand_id: validatedFields.data.brand_id,
      status: true,
    })
    .select("id")
    .single();

  if (roleError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [roleError.message],
      },
    };
  }

  const rolePermissionData = validatedFields.data.role_permissions.map(
    (permission) => ({
      clients_id: currentClientId,
      client_profiles_id: currentUserId,
      role_id: roleData.id,
      permission_id: permission.permission_id,
      brand_id: validatedFields.data.brand_id,
    }),
  );
  const { error: rolePermissionError } = await supabase
    .from("role_permissions")
    .insert(rolePermissionData);

  if (rolePermissionError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [rolePermissionError.message],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function deleteUserRole(
  prevState: UserRoleFormState,
  formData: FormData,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("roles")
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
