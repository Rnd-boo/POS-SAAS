"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { SIDEBAR_MENULIST, SidebarMenuKey } from "@/constants/sidebar.constant";
import { cn } from "@/lib/utils";
import { EllipsisVertical, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { signOut } from "@/actions/auth-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DarkModeToggle } from "./darkmode-toggle";

export function AppSidebar() {
  const { open, setOpen } = useSidebar();

  const pathname = usePathname();
  const profile = useAuthStore((state) => state.profile);
  const brands = useBrandStore((state) => state.brands);
  const currentBrandId = useBrandStore((state) => state.currentBrandId);
  const setCurrentBrand = useBrandStore((state) => state.setCurrentBrand);
  const currentBrandName = brands.find(
    (brand) => String(brand.id) === currentBrandId,
  )?.name;
  const [openItem, setOpenItem] = useState<string | null>(null);

  useEffect(() => {
    // Find which section contains the current pathname
    const currentSection = SIDEBAR_MENULIST[
      profile?.role as SidebarMenuKey
    ]?.find((item) => {
      return item.url === pathname;
    });

    // If we found a section with sub-items, open it (and close others)
    if (currentSection) {
      setOpenItem(currentSection.title);
    }
    // If no matching section found, keep the currently open item (don't close it)
  }, [pathname, profile?.role]);

  const toggleSingleItem = (title: string) => {
    // If clicking the same item, close it
    // If clicking different item, close current and open new one
    if (openItem === title) {
      setOpenItem(null); // Close current item
    } else {
      setOpenItem(title); // Open new item (closes others)
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      onClick={!open ? () => setOpen(true) : undefined}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent py-8"
            >
              <Link href="/" className="font-semibold">
                <div className=" flex p-2 items-center justify-center rounded-md">
                  {/* <Coffee className="size-5 text-white" /> */}
                </div>
                {/* POS */}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {SIDEBAR_MENULIST[profile?.role as SidebarMenuKey]?.map(
                (item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a
                        href={item.url}
                        className={cn("ring-sidebar-ring px-4 py-3 h-auto ", {
                          "bg-primary/90 text-white hover:text-white hover:!bg-primary/80 ":
                            pathname === item.url ||
                            pathname.startsWith(item.url + "/"),
                        })}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={profile?.name ?? "Account"}
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage
                      src="https://tgspmwvxvpbzhcvcltta.supabase.co/storage/v1/object/public/images/avatar.png"
                      alt={profile?.name ?? "Account avatar"}
                    />
                    <AvatarFallback className="rounded-lg">
                      {profile?.name?.slice(0, 2).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex min-w-0 flex-1 flex-col items-start text-left text-sm">
                    <span className="w-full truncate font-xl ">
                      {profile?.name ?? "Account"}
                    </span>
                  </span>
                  <EllipsisVertical className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={open ? "top" : "right"}
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium ">
                      {profile?.name ?? "Account"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {profile?.role ?? "User"}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      {currentBrandName ?? "Select brand"}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {brands.map((brand) => (
                        <DropdownMenuItem
                          key={brand.id}
                          onClick={() => setCurrentBrand(String(brand.id))}
                        >
                          {brand.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DarkModeToggle className="w-full" />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  variant="destructive"
                >
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
