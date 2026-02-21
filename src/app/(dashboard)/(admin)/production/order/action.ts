"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { ProductionOrderFormState } from "@/types/production/production-order";
import { productionOrderSchema } from "@/validations/production/production-order.validation";

export async function createProductionOrder(
  prevState: ProductionOrderFormState,
  formData: FormData,
) {
  const supabase = await createClient();
  const { currentUserId, currentClientId } = await getCurrentProfile();

  const validatedProductionOrderFields = productionOrderSchema.safeParse({
    production_order_date: formData.get("production_order_date"),
    notes: formData.get("notes"),
    branch_id: Number(formData.get("branch_id")),
    brand_id: Number(formData.get("brand_id")),
    bill_of_materials_id: formData.get("bill_of_materials_id"),
    qty: formData.get("qty"),
    type: formData.get("type"),
    status: "new",
  });

  if (!validatedProductionOrderFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedProductionOrderFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const dateStr = validatedProductionOrderFields.data.production_order_date; // "YYYY-MM-DD"
  const [year, month, day] = dateStr.split("-");

  const { data: existingDFs, error: countError } = await supabase
    .from("production_orders")
    .select("id")
    .like("id", `DF${year}${month}${day}%`)
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

  const dfNumber = `DF${year}${month}${day}${String(sequenceNumber).padStart(4, "0")}`;

  const { error } = await supabase
    .from("production_orders")
    .insert({
      id: dfNumber,
      client_profiles_id: currentUserId,
      clients_id: currentClientId,
      production_order_date:
        validatedProductionOrderFields.data.production_order_date,
      notes: validatedProductionOrderFields.data.notes,
      branch_id: validatedProductionOrderFields.data.branch_id,
      brand_id: validatedProductionOrderFields.data.brand_id,
      bill_of_materials_id:
        validatedProductionOrderFields.data.bill_of_materials_id,
      qty: validatedProductionOrderFields.data.qty,
      type: validatedProductionOrderFields.data.type,
      status: validatedProductionOrderFields.data.status,
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
