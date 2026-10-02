// actions/suppliers.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getSupplierPICDetail(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("supplier_pic")
    .select("phone, name, email")
    .eq("supplier_id", id)
    .eq("is_default", true);
  if (error) throw error;
  return data;
}
