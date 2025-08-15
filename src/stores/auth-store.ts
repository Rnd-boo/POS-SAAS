import { create } from "zustand";
import { INITTIAL_STATE_PROFILE } from "@/constants/auth.constant";
import { Profile } from "@/types/profiles";

type AuthState = {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
