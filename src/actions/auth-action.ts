"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  const cookiesStore = await cookies();

  try {
    cookiesStore.delete("client_session");
    revalidatePath("/", "layout");
  } catch (error) {
    console.log("Error signin out", error);
  }
  redirect("/");
}
