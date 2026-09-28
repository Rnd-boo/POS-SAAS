"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { ClientProfilesFormState } from "@/types/profiles";
import { userFormSchema } from "@/validations/user/user.validation";
import bcrypt from "bcryptjs";

export async function createUser(
  prevState: ClientProfilesFormState,
  formData: FormData,
) {
  const validatedFields = userFormSchema.safeParse({
    username: formData.get("username"),
    password_hash: formData.get("password_hash"),
    name: formData.get("name"),
    status: formData.get("status") === "true" ? true : false,
    roles_id: formData.get("roles_id"),
    brand_id: formData.get("brand_id"),
    client_branches: JSON.parse(formData.get("client_branches") as string),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  console.log(validatedFields);
  const passwordHashed = await bcrypt.hash(
    validatedFields.data.password_hash,
    12,
  );

  const supabase = await createClient();

  const { currentClientId } = await getCurrentProfile();

  const { data: clientProfiles, error: clientProfileError } = await supabase
    .from("client_profiles")
    .insert({
      clients_id: currentClientId,
      name: validatedFields.data.name,
      username: validatedFields.data.username,
      password_hash: passwordHashed,
      brand_id: Number(validatedFields.data.brand_id),
      roles_id: validatedFields.data.roles_id,
      status: validatedFields.data.status,
    })
    .select("id")
    .single();

  if (clientProfileError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [clientProfileError.message],
      },
    };
  }

  const userBranches = validatedFields.data.client_branches.map((client) => ({
    clients_id: currentClientId,
    client_profiles_id: clientProfiles.id,
    role_id: client.branch_id,
  }));
  const { error: userBranchesError } = await supabase
    .from("client_branches")
    .insert(userBranches);

  if (userBranchesError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [userBranchesError.message],
      },
    };
  }

  return {
    status: "success",
  };
}
