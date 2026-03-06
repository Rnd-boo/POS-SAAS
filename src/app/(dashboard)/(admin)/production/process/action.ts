"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { ProductionProcessFormState } from "@/types/production/production-process";
import { productionProcessSchema } from "@/validations/production/production-process.validation";

export async function createProductionProcess(
  prevState: ProductionProcessFormState,
  formData: FormData,
) {
  const supabase = await createClient();
  const { currentUserId, currentClientId } = await getCurrentProfile();

  const validatedProductionProcessFields = productionProcessSchema.safeParse({
    production_process_date: formData.get("production_process_date"),
    production_orders_id: formData.get("production_orders_id"),
    branch_id: Number(formData.get("branch_id")),
    brand_id: Number(formData.get("brand_id")),
    branch_location_id: Number(formData.get("branch_location_id")),
    qty: Number(formData.get("qty")),
    notes: formData.get("notes"),
    status: "new",
  });

  if (!validatedProductionProcessFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedProductionProcessFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const dateStr = validatedProductionProcessFields.data.production_process_date; // "YYYY-MM-DD"
  const [year, month, day] = dateStr.split("-");

  const { data: existingDFs, error: countError } = await supabase
    .from("production_process")
    .select("id")
    .like("id", `PP${year}${month}${day}%`)
    .order("id", { ascending: false })
    .limit(1);

  if (countError) {
    return {
      status: "error",
      errors: {
        _form: [`Failed to check existing DFs: ${countError.message}`],
      },
    };
  }

  let sequenceNumber = 1;
  if (existingDFs && existingDFs.length > 0) {
    const lastDF = existingDFs[0].id;
    const lastSequence = parseInt(lastDF.slice(-4));
    sequenceNumber = lastSequence + 1;
  }

  const ppNumber = `PP${year}${month}${day}${String(sequenceNumber).padStart(4, "0")}`;

  const { error } = await supabase
    .from("production_process")
    .insert({
      id: ppNumber,
      client_profiles_id: currentUserId,
      clients_id: currentClientId,
      production_process_date:
        validatedProductionProcessFields.data.production_process_date,
      production_orders_id:
        validatedProductionProcessFields.data.production_orders_id,
      branch_id: validatedProductionProcessFields.data.branch_id,
      branch_location_id:
        validatedProductionProcessFields.data.branch_location_id,
      brand_id: validatedProductionProcessFields.data.brand_id,
      qty: validatedProductionProcessFields.data.qty,
      notes: validatedProductionProcessFields.data.notes,
      status: validatedProductionProcessFields.data.status,
    })
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

  return {
    status: "success",
  };
}

export async function deleteProductionProcess(
  prevState: ProductionProcessFormState,
  formData: FormData,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("production_process")
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
