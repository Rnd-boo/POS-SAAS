"use server";

import { createClient } from "@/lib/supabase/server";
import { BranchFormState } from "@/types/branch";

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
