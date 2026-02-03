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
      items: [],
    },
      {
      title: "Production Planning",
      icon: Warehouse,
      url: "/production",
       items: [],
    },
    {
      title: "Inventory",
      icon: Warehouse,
      url: "/inventory",
       items: [],
    },
    {
      title: "Master Data",
      url: "/master-data",
      icon: Archive,
      items: [],
    },
    {
      title: "User",
      url: "/user",
      icon: Users,
      items: [],
    },
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/",
      icon: Component,
      items: [],
    },
    {
      title: "Production Planning",
      icon: CalendarPlus,
      url: "/production",
       items: [],
    },
    {
      title: "Inventory",
      icon: Warehouse,
      url: "/inventory",
       items: [],
    },
    {
      title: "Master Data",
      url: "/master-data",
      icon: Archive,
      items: [],
    },
  ],
  cashier: [
    {
      title: "Order",
      url: "/order",
      icon: FileText,
      items: [],
    },
  ],
  kitchen: [
    {
      title: "Order",
      url: "/order",
      icon: FileText,
      items: [],
    },
  ],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENULIST;
