import {
  Archive,
  CalendarPlus,
  Component,
  FileText,
  Users,
  Warehouse,
} from "lucide-react";

export const SIDEBAR_MENULIST = {
  supervisor: [
    {
      title: "Dashboard",
      url: "/",
      icon: Component,
    },
    {
      title: "Production Planning",
      icon: CalendarPlus,
      url: "/production",
    },
    {
      title: "Inventory",
      icon: Warehouse,
      url: "/inventory",
    },
    {
      title: "Master Data",
      url: "/master-data",
      icon: Archive,
    },
    {
      title: "User",
      url: "/user",
      icon: Users,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/",
      icon: Component,
    },
    {
      title: "Production Planning",
      icon: CalendarPlus,
      url: "/production",
    },
    {
      title: "Inventory",
      icon: Warehouse,
      url: "/inventory",
    },
    {
      title: "Master Data",
      url: "/master-data",
      icon: Archive,
    },
  ],
  cashier: [
    {
      title: "Order",
      url: "/order",
      icon: FileText,
    },
  ],
  kitchen: [
    {
      title: "Order",
      url: "/order",
      icon: FileText,
    },
  ],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENULIST;
