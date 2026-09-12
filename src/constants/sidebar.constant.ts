import {
  Archive,
  CalendarPlus,
  Component,
  FileText,
  Users,
  Warehouse,
} from "lucide-react";

export const SIDEBAR_MENULIST = [
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
];

export type SidebarMenuKey = keyof typeof SIDEBAR_MENULIST;
