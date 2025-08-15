"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Profile } from "@/types/profiles";
import { ReactNode, useEffect } from "react";

export default function AuthStoreProvider({
  children,
  profile,
}: {
  children: ReactNode;
  profile: Profile;
}) {
  useEffect(() => {
    useAuthStore.getState().setProfile(profile);
  }, [profile]);

  return <>{children}</>;
}
