"use server";

import { getCurrentProfile } from "@/lib/get-current-profile";
import { createClient } from "@/lib/supabase/server";
import { OrderContextFormState } from "@/types/pos/order-context";
import { orderContextSchema } from "@/validations/pos/order-context.validation";

export async function createOrderContext(
  prevState: OrderContextFormState,
  formData: FormData
) {
  const validatedFields = orderContextSchema.safeParse({
    name: formData.get("name"),
    tax_value: Number(formData.get("tax_value")),
    tax_name: formData.get("tax_name"),
    other_tax_value: Number(formData.get("other_tax_value")),
    other_tax_name: formData.get("other_tax_name"),
    status: formData.get("status") === "true" ? true : false,
    brand_id: formData.get("brand_id"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: { ...validatedFields.error.flatten().fieldErrors, _form: [] },
    };
  }

  const supabase = await createClient();
  const { currentUserId, currentClientId } = await getCurrentProfile();

  const { error } = await supabase.from("order_context").insert({
    client_profiles_id: currentUserId,
    clients_id: currentClientId,
    name: validatedFields.data.name,
    tax_value: validatedFields.data.tax_value,
    tax_name: validatedFields.data.tax_name,
    other_tax_value: validatedFields.data.other_tax_value,
    other_tax_name: validatedFields.data.other_tax_name,
    status: validatedFields.data.status,
    brand_id: validatedFields.data.brand_id,
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

export async function updateOrderContext(
  prevState: OrderContextFormState,
  formData: FormData
) {
  const validatedFields = orderContextSchema.safeParse({
    name: formData.get("name"),
    tax_value: Number(formData.get("tax_value")),
    tax_name: formData.get("tax_name"),
    other_tax_value: Number(formData.get("other_tax_value")),
    other_tax_name: formData.get("other_tax_name"),
    status: formData.get("status") === "true" ? true : false,
    brand_id: formData.get("brand_id"),
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
    .from("order_context")
    .update({
      name: validatedFields.data.name,
      tax_value: validatedFields.data.tax_value,
      tax_name: validatedFields.data.tax_name,
      other_tax_value: validatedFields.data.other_tax_value,
      other_tax_name: validatedFields.data.other_tax_name,
      status: validatedFields.data.status,
      brand_id: validatedFields.data.brand_id,
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

export async function deleteOrderContext(
  prevState: OrderContextFormState,
  formData: FormData
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("order_context")
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
