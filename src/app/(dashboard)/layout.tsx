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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth-store";
import { ArrowLeftRight, LogOut } from "lucide-react";
import DashboardBreadCrumb from "./_components/dashboard-breadcrumb";
import { useBrandStore } from "@/stores/brand-store";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useBranches } from "@/hooks/use-branches";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = useAuthStore((state) => state.profile);
  const brands = useBrandStore((s) => s.brands);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const setCurrentBrand = useBrandStore((s) => s.setCurrentBrand);
  const currentBrandName = brands.find(
    (brand) => String(brand.id) === currentBrandId
  )?.name;
  const { data: branches, isLoading } = useBranches();

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
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="ghost" className="cursor-pointer">
                  Branches <ArrowLeftRight />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>
                    Multiple Branches in {currentBrandName}
                  </DrawerTitle>
                  <DrawerDescription>
                    Overview of all active branches
                  </DrawerDescription>
                </DrawerHeader>
                <div className="capitalize grid list-inside mx-4">
                  {branches?.map((b) => (
                    <li key={b.id}>{b.name}</li>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      {currentBrandName}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {Array.isArray(brands) && brands.length > 0 && (
                        <DropdownMenuRadioGroup
                          value={currentBrandId ?? ""}
                          onValueChange={(value) => setCurrentBrand(value)}
                        >
                          {brands.map((b) => (
                            <DropdownMenuRadioItem key={b.id} value={`${b.id}`}>
                              {b.name}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
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
