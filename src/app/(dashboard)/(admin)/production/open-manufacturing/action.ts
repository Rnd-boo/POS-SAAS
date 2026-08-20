"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { OpenManufacturingFormState } from "@/types/production/open-manufacturing";
import { openManufacturingFormSchema } from "@/validations/production/open-manufacturing.validation";

export async function createOpenManufacturing(
  prevState: OpenManufacturingFormState,
  formData: FormData,
) {
  const supabase = await createClient();

  const { currentUserId, currentClientId } = await getCurrentProfile();

  const validatedFields = openManufacturingFormSchema.safeParse({
    open_manufacturing_date: formData.get("open_manufacturing_date"),
    branch_id: formData.get("branch_id"),
    notes: formData.get("notes"),
    origin_branch_location_id: formData.get("origin_branch_location_id"),
    destination_branch_location_id: formData.get(
      "destination_branch_location_id",
    ),
    product_units_id: formData.get("product_units_id"),
    products_id: formData.get("products_id"),
    bill_of_materials_id: formData.get("bill_of_materials_id"),
    product_name: formData.get("product_name"),
    type: formData.get("type"),
    qty: formData.get("qty"),
    brand_id: formData.get("brand_id"),
    products_detail: JSON.parse(formData.get("products_detail") as string),
  });
  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }
  const dateStr = validatedFields.data.open_manufacturing_date; // "YYYY-MM-DD"
  const [year, month, day] = dateStr.split("-");

  const { data: existingOMs, error: countError } = await supabase
    .from("open_manufacturing")
    .select("id")
    .like("id", `OM${year}${month}${day}%`)
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
  if (existingOMs && existingOMs.length > 0) {
    const lastDF = existingOMs[0].id;
    const lastSequence = parseInt(lastDF.slice(-4));
    sequenceNumber = lastSequence + 1;
  }

  const omNumber = `OM${year}${month}${day}${String(sequenceNumber).padStart(4, "0")}`;

  const { data: openManufacturingData, error: openManufacturingError } =
    await supabase
      .from("open_manufacturing")
      .insert({
        id: omNumber,
        client_profiles_id: currentUserId,
        clients_id: currentClientId,
        open_manufacturing_date: validatedFields.data.open_manufacturing_date,
        branch_id: validatedFields.data.branch_id,
        brand_id: validatedFields.data.brand_id,
        notes: validatedFields.data.notes,
        origin_branch_location_id:
          validatedFields.data.origin_branch_location_id,
        destination_branch_location_id:
          validatedFields.data.destination_branch_location_id,
        product_units_id: validatedFields.data.product_units_id,
        bill_of_materials_id:
          validatedFields.data.bill_of_materials_id === ""
            ? undefined
            : validatedFields.data.bill_of_materials_id,
        product_name: validatedFields.data.product_name,
        type: validatedFields.data.type,
        qty: validatedFields.data.qty,
      })
      .select("id")
      .single();

  if (openManufacturingError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [openManufacturingError.message],
      },
    };
  }

  const openManufacturingDetail = validatedFields.data.products_detail.map(
    (om) => ({
      open_manufacturing_id: openManufacturingData.id,
      clients_id: currentClientId,
      client_profiles_id: currentUserId,
      product_units_id: om.product_units_id,
      qty: om.qty,
      product_name: om.product_name,
    }),
  );

  const { error: openManufacturingDetailError } = await supabase
    .from("open_manufacturing_detail")
    .insert(openManufacturingDetail);

  if (openManufacturingDetailError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [openManufacturingDetailError.message],
      },
    };
  }

  // Apply Stock Movement and Adjust Stock On Hand

  await supabase.rpc("apply_stock_movement", {
    p_products_id: validatedFields.data.products_id,
    p_branch_location_id: validatedFields.data.destination_branch_location_id,
    p_product_units_id: validatedFields.data.product_units_id,

    p_movement_type: "OPEN MANUFACTURING",
    p_direction: "IN",

    p_qty: validatedFields.data.qty,

    p_reference_type: "OPEN MANUFACTURING",
    p_reference_id: openManufacturingData.id,

    p_movement_date: validatedFields.data.open_manufacturing_date,

    p_client_profiles_id: currentUserId,
    p_clients_id: currentClientId,
  });

  const productsDetailMovement = validatedFields.data.products_detail.map(
    (om) => ({
      p_products_id: om.products_id,
      p_branch_location_id: validatedFields.data.origin_branch_location_id,
      p_product_units_id: om.product_units_id,

      p_movement_type: "OPEN MANUFACTURING",
      p_direction: "OUT",

      p_qty: om.qty,

      p_reference_type: "OPEN MANUFACTURING",
      p_reference_id: openManufacturingData.id,

      p_movement_date: validatedFields.data.open_manufacturing_date,

      p_client_profiles_id: currentUserId,
      p_clients_id: currentClientId,
    }),
  );

  await supabase.rpc("apply_stock_movements", {
    p_movements: productsDetailMovement,
  });

  return {
    status: "success",
  };
}

export async function updateOpenManufacturing(
  prevState: OpenManufacturingFormState,
  formData: FormData,
) {
  const supabase = await createClient();
  const { currentUserId, currentClientId } = await getCurrentProfile();

  const openManufacturingId = String(formData.get("id") ?? "");
  if (!openManufacturingId) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Open manufacturing id is required"],
      },
    };
  }

  const validatedFields = openManufacturingFormSchema.safeParse({
    open_manufacturing_date: formData.get("open_manufacturing_date"),
    branch_id: formData.get("branch_id"),
    notes: formData.get("notes"),
    origin_branch_location_id: formData.get("origin_branch_location_id"),
    destination_branch_location_id: formData.get(
      "destination_branch_location_id",
    ),
    product_units_id: formData.get("product_units_id"),
    products_id: formData.get("products_id"),
    bill_of_materials_id: formData.get("bill_of_materials_id"),
    product_name: formData.get("product_name"),
    type: formData.get("type"),
    qty: formData.get("qty"),
    brand_id: formData.get("brand_id"),
    products_detail: JSON.parse(formData.get("products_detail") as string),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  // when stock have been used, we cannot update the open manufacturing. We need to check if there are any stock movements that have been made after the open manufacturing date for the products and branch locations involved in this open manufacturing. If there are, we should return an error indicating that the open manufacturing cannot be updated because the stock has already been used.

  // const affectedProductIds = [
  //   validatedFields.data.products_id,
  //   ...validatedFields.data.products_detail
  //     .map((item) => item.products_id)
  //     .filter(Boolean),
  // ];
  // const affectedBranchLocations = [
  //   validatedFields.data.origin_branch_location_id,
  //   validatedFields.data.destination_branch_location_id,
  // ].filter(Boolean);

  // const { data: laterStockUsage, error: laterStockUsageError } = await supabase
  //   .from("stock_movements")
  //   .select("id, products_id, branch_location_id, movement_date")
  //   .in("products_id", affectedProductIds)
  //   .in("branch_location_id", affectedBranchLocations)
  //   .gte("movement_date", validatedFields.data.open_manufacturing_date)
  //   .neq("reference_id", openManufacturingId);

  // if (laterStockUsageError) {
  //   return {
  //     status: "error",
  //     errors: {
  //       ...prevState.errors,
  //       _form: [laterStockUsageError.message],
  //     },
  //   };
  // }

  // if ((laterStockUsage ?? []).length > 0) {
  //   return {
  //     status: "error",
  //     errors: {
  //       ...prevState.errors,
  //       _form: [
  //         "This open manufacturing cannot be updated because the stock has already been used.",
  //       ],
  //     },
  //   };
  // }

  const { data: existingMovements, error: existingMovementsError } =
    await supabase
      .from("stock_movements")
      .select(
        "id, reference_id, reference_type, qty_base, products_id, branch_location_id, direction",
      )
      .eq("reference_id", openManufacturingId)
      .eq("reference_type", "OPEN MANUFACTURING");

  if (existingMovementsError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [existingMovementsError.message],
      },
    };
  }

  for (const movement of existingMovements || []) {
    const { data: productStock, error: productStockError } = await supabase
      .from("product_stocks")
      .select("id,on_hand")
      .eq("products_id", movement.products_id)
      .eq("branch_location_id", movement.branch_location_id)
      .maybeSingle();

    if (productStockError) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [productStockError.message],
        },
      };
    }

    if (!productStock) continue;

    const stockChange =
      movement.direction === "IN"
        ? -Number(movement.qty_base)
        : Number(movement.qty_base);
    const updatedOnHand = Number(productStock.on_hand) + Number(stockChange);

    const { error: revertStockError } = await supabase
      .from("product_stocks")
      .update({ on_hand: updatedOnHand })
      .eq("id", productStock.id);

    if (revertStockError) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [revertStockError.message],
        },
      };
    }
  }

  const { error: deleteMovementError } = await supabase
    .from("stock_movements")
    .delete()
    .eq("reference_id", openManufacturingId)
    .eq("reference_type", "OPEN MANUFACTURING");

  if (deleteMovementError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [deleteMovementError.message],
      },
    };
  }

  const { error: updateError } = await supabase
    .from("open_manufacturing")
    .update({
      open_manufacturing_date: validatedFields.data.open_manufacturing_date,
      branch_id: validatedFields.data.branch_id,
      brand_id: validatedFields.data.brand_id,
      notes: validatedFields.data.notes,
      origin_branch_location_id: validatedFields.data.origin_branch_location_id,
      destination_branch_location_id:
        validatedFields.data.destination_branch_location_id,
      product_units_id: validatedFields.data.product_units_id,
      bill_of_materials_id:
        validatedFields.data.bill_of_materials_id === ""
          ? undefined
          : validatedFields.data.bill_of_materials_id,
      product_name: validatedFields.data.product_name,
      type: validatedFields.data.type,
      qty: validatedFields.data.qty,
    })
    .eq("id", openManufacturingId)
    .eq("clients_id", currentClientId);

  if (updateError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [updateError.message],
      },
    };
  }

  const { error: deleteDetailsError } = await supabase
    .from("open_manufacturing_detail")
    .delete()
    .eq("open_manufacturing_id", openManufacturingId);

  if (deleteDetailsError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [deleteDetailsError.message],
      },
    };
  }

  const openManufacturingDetail = validatedFields.data.products_detail.map(
    (om) => ({
      open_manufacturing_id: openManufacturingId,
      clients_id: currentClientId,
      client_profiles_id: currentUserId,
      product_units_id: om.product_units_id,
      qty: om.qty,
      product_name: om.product_name ?? validatedFields.data.product_name ?? "",
    }),
  );

  const { error: openManufacturingDetailError } = await supabase
    .from("open_manufacturing_detail")
    .insert(openManufacturingDetail);

  if (openManufacturingDetailError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [openManufacturingDetailError.message],
      },
    };
  }

  await supabase.rpc("apply_stock_movement", {
    p_products_id: validatedFields.data.products_id,
    p_branch_location_id: validatedFields.data.destination_branch_location_id,
    p_product_units_id: validatedFields.data.product_units_id,
    p_movement_type: "OPEN MANUFACTURING",
    p_direction: "IN",
    p_qty: validatedFields.data.qty,
    p_reference_type: "OPEN MANUFACTURING",
    p_reference_id: openManufacturingId,
    p_movement_date: validatedFields.data.open_manufacturing_date,
    p_client_profiles_id: currentUserId,
    p_clients_id: currentClientId,
  });

  const productsDetailMovement = validatedFields.data.products_detail.map(
    (om) => ({
      p_products_id: om.products_id,
      p_branch_location_id: validatedFields.data.origin_branch_location_id,
      p_product_units_id: om.product_units_id,
      p_movement_type: "OPEN MANUFACTURING",
      p_direction: "OUT",
      p_qty: om.qty,
      p_reference_type: "OPEN MANUFACTURING",
      p_reference_id: openManufacturingId,
      p_movement_date: validatedFields.data.open_manufacturing_date,
      p_client_profiles_id: currentUserId,
      p_clients_id: currentClientId,
    }),
  );

  await supabase.rpc("apply_stock_movements", {
    p_movements: productsDetailMovement,
  });

  return { status: "success" };
}

export async function deleteOpenManufacturing(
  prevState: OpenManufacturingFormState,
  formData: FormData,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("open_manufacturing")
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
  const movements = await supabase
    .from("stock_movements")
    .select(
      "id,reference_id,reference_type,qty_base,products_id,branch_location_id,direction",
    )
    .eq("reference_id", formData.get("id"));

  for (const movement of movements.data || []) {
    const { data: productStock } = await supabase
      .from("product_stocks")
      .select("id,on_hand")
      .eq("products_id", movement.products_id)
      .eq("branch_location_id", movement.branch_location_id)
      .single();

    const stockChange =
      movement.direction === "IN" ? -movement.qty_base : movement.qty_base;

    const { error } = await supabase
      .from("product_stocks")
      .update({
        on_hand: Number(productStock?.on_hand) + Number(stockChange),
      })
      .eq("id", productStock?.id);
    if (error) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [error.message],
        },
      };
    }
  }

  const { error: deleteMovementError } = await supabase
    .from("stock_movements")
    .delete()
    .eq("reference_id", formData.get("id"));

  if (deleteMovementError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [deleteMovementError.message],
      },
    };
  }
  return { status: "success" };
}
