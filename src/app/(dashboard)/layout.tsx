"use client";

import { signOut } from "@/actions/auth-action";
import { AppSidebar } from "@/components/common/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth-store";
import { LogOut } from "lucide-react";
import DashboardBreadCrumb from "./_components/dashboard-breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = useAuthStore((state) => state.profile);
  console.log("Profile in layout:", profile);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]:h-12">
          <div className="flex items-center">
            <SidebarTrigger className="cursor-[ew-resize] mx-3" />
            <Separator
              orientation="vertical"
              className="mr-4 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadCrumb />
          </div>
          <div className="flex gap-4 items-center px-6">
            <h1 className="uppercase">{profile?.brand}</h1>
            {/* <h1 className="uppercase">{profile?.branch}</h1> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 rounded-lg hover:bg-muted">
                  <AvatarImage
                    src="https://tgspmwvxvpbzhcvcltta.supabase.co/storage/v1/object/public/images/avatar.png"
                    alt={profile?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {profile?.name}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="capitalize">
                  {profile?.name}
                </DropdownMenuLabel>
                <Separator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      signOut();
                    }}
                  >
                    <LogOut /> Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col items-start gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
