import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full min-h-screen bg-muted">
      <div className="absolute bottom-5 left-5">
        <DarkModeToggle className="w-full px-4  rounded-full" />
      </div>
      <div>{children}</div>
    </div>
  );
}
