import { getProfileFromToken } from "@/actions/auth-action";
import { cookies } from "next/headers";
export type CurrentProfile = {
  currentUserId: string | null;
  currentClientId: string | null;
};
export async function getCurrentProfile(): Promise<CurrentProfile> {
  let currentUserId: string | null = null;
  let currentClientId: string | null = null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("client_profile")?.value;

    if (token) {
      const profile = await getProfileFromToken(token);
      currentUserId = profile?.id || null;
      currentClientId = profile?.clients || null;
    }
  } catch (error) {
    console.log("Custom token method failed:", error);
  }
  return { currentUserId, currentClientId };
}
