"use server";

import { environment } from "@/configs/environment";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CreateClientOptions = {
  isAdmin?: boolean;
};

export async function createClient({
  isAdmin = false,
}: CreateClientOptions = {}) {
  const cookieStore = await cookies();
  const { SUPABASE_ANON_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } =
    environment;

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient(
    SUPABASE_URL!,
    isAdmin ? SUPABASE_SERVICE_ROLE_KEY! : SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            console.log("Error setting cookies", cookiesToSet);
          }
        },
      },
    }
  );
}
