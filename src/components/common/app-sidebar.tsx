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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { DarkModeToggle } from "./darkmode-toggle";
import { usePathname } from "next/navigation";
import { SIDEBAR_MENULIST, SidebarMenuKey } from "@/constants/sidebar.constant";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronRight, Coffee } from "lucide-react";
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
      return (
        item.url === pathname ||
        item.items?.some((subItem) => subItem.url === pathname)
      );
    });

    // If we found a section with sub-items, open it (and close others)
    if (
      currentSection &&
      currentSection.items &&
      currentSection.items.length > 0
    ) {
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
                <div className="bg-ungu flex p-2 items-center justify-center rounded-md">
                  <Coffee className="size-5 text-white" />
                </div>
                POS
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
                    {item.items && item.items.length > 0 ? (
                      <Collapsible
                        key={item.title}
                        open={openItem === item.title}
                        className="group/collapsible"
                      >
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              className={cn("px-4 py-3 h-auto", {
                                "bg-ungu text-white hover:bg-ungu hover:text-white":
                                  pathname === item.url,
                              })}
                              onClick={(e) => {
                                e.preventDefault();
                                toggleSingleItem(item.title);
                              }}
                            >
                              {item.icon && <item.icon />}
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub className="pt-2">
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuButton
                                    asChild
                                    tooltip={subItem.title}
                                  >
                                    <a
                                      href={subItem.url}
                                      className={cn("px-4 py-3 h-auto", {
                                        "bg-ungu text-white hover:bg-ungu hover:text-white":
                                          pathname === subItem.url,
                                      })}
                                    >
                                      <span>{subItem.title}</span>
                                    </a>
                                  </SidebarMenuButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a
                          href={item.url}
                          className={cn("px-4 py-3 h-auto", {
                            "bg-ungu text-white hover:bg-ungu hover:text-white":
                              pathname === item.url,
                          })}
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                )
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
