import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute bottom-5 left-5">
        <DarkModeToggle />
      </div>
      <div>{children}</div>
    </div>
  );
}
