"use server";

import { getJwtSecretKey } from "@/lib/jwt";
import { Profile } from "@/types/profiles";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as jose from "jose";

export async function signOut() {
  const cookiesStore = await cookies();

  try {
    cookiesStore.delete("client_profile");
    revalidatePath("/", "layout");
  } catch (error) {
    console.log("Error signin out", error);
  }
  redirect("/");
}

export async function getProfileFromToken(
  token: string
): Promise<Profile | null> {
  try {
    const { payload } = await jose.jwtVerify(token, getJwtSecretKey());
    return payload as Profile;
  } catch (err) {
    console.error("Invalid JWT", err);
    return null;
  }
}
