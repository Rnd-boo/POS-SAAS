"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { StockAdjustmentFormState } from "@/types/inventory/stock-adjustment";
import { stockAdjustmentFormSchema } from "@/validations/inventory/stock-adjustment.validation";

export async function createStockAdjustment(
  prevState: StockAdjustmentFormState,
  formData: FormData,
) {
  const supabase = await createClient();

  const { currentUserId, currentClientId } = await getCurrentProfile();

  const validatedFields = stockAdjustmentFormSchema.safeParse({
    stock_adjustment_date: formData.get("stock_adjustment_date"),
    branch_id: formData.get("branch_id"),
    notes: formData.get("notes"),
    branch_location_id: formData.get("branch_location_id"),
    reason: formData.get("reason"),
    brand_id: formData.get("brand_id"),
    stock_adjustment_items: JSON.parse(
      formData.get("stock_adjustment_items") as string,
    ),
  });
  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }
  const dateStr = validatedFields.data.stock_adjustment_date; // "YYYY-MM-DD"
  const [year, month, day] = dateStr.split("-");

  const { data: existingSAs, error: countError } = await supabase
    .from("stock_adjustments")
    .select("id")
    .like("id", `SA${year}${month}${day}%`)
    .order("id", { ascending: false })
    .limit(1);

  if (countError) {
    return {
      status: "error",
      errors: {
        _form: [`Failed to check existing OMs: ${countError.message}`],
      },
    };
  }

  let sequenceNumber = 1;
  if (existingSAs && existingSAs.length > 0) {
    const lastDF = existingSAs[0].id;
    const lastSequence = parseInt(lastDF.slice(-4));
    sequenceNumber = lastSequence + 1;
  }

  const saNumber = `SA${year}${month}${day}${String(sequenceNumber).padStart(4, "0")}`;

  const { error: stockAdjusmentError } = await supabase
    .from("stock_adjustments")
    .insert({
      id: saNumber,
      client_profiles_id: currentUserId,
      clients_id: currentClientId,
      stock_adjustment_date: validatedFields.data.stock_adjustment_date,
      branch_id: validatedFields.data.branch_id,
      brand_id: validatedFields.data.brand_id,
      notes: validatedFields.data.notes,
      branch_location_id: validatedFields.data.branch_location_id,
      reason: validatedFields.data.reason,
      status: "new",
    });

  if (stockAdjusmentError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [stockAdjusmentError.message],
      },
    };
  }

  const stockAdjustmentItems = validatedFields.data.stock_adjustment_items.map(
    (om) => ({
      stock_adjustments_id: saNumber,
      clients_id: currentClientId,
      client_profiles_id: currentUserId,
      product_units_id: om.product_units_id,
      current_qty: om.current_qty,
      product_name: om.product_name,
    }),
  );

  const { error: stockAdjustmentItemsError } = await supabase
    .from("stock_adjustment_items")
    .insert(stockAdjustmentItems);

  if (stockAdjustmentItemsError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [stockAdjustmentItemsError.message],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function rejectStockAdjustment(
  prevState: StockAdjustmentFormState,
  formData: FormData,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("stock_adjustments")
    .update({
      status: "rejected",
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

  return { status: "success" };
}

export async function approveStockAdjustment(
  prevState: StockAdjustmentFormState,
  formData: FormData,
) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("approve_stock_adjustment", {
    p_stock_adjustments_id: formData.get("id"),
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
