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
import { DarkModeToggle } from "./darkmode-toggle";
import { usePathname } from "next/navigation";
import { SIDEBAR_MENULIST, SidebarMenuKey } from "@/constants/sidebar.constant";
import { cn } from "@/lib/utils";
import { Coffee } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function AppSidebar() {
  const { open, setOpen } = useSidebar();

  const pathname = usePathname();
  const profile = useAuthStore((state) => state.profile);
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
            <SidebarMenuButton asChild>
              <DarkModeToggle className="data-[collapsed=true]:w-8 data-[collapsed=true]:h-8" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
