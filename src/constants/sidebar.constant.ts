import {
  Archive,
  BookMarked,
  Component,
  FileText,
  Ratio,
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
      title: "Inventory",
      icon: Warehouse,
      url: "#",
      items: [
        { title: "Receiving", url: "/admin/receiving" },
        { title: "Shipping", url: "/admin/shipping" },
        { title: "Stock list", url: "/admin/stock-list" },
        { title: "Purchase Return", url: "/admin/purchase-return" },
      ],
    },
    // {
    //   title: "Product",
    //   url: "/admin/product",
    //   icon: BookMarked,
    //   items: [],
    // },
    {
      title: "Order",
      url: "/order",
      icon: FileText,
      items: [],
    },
    {
      title: "Table",
      url: "/admin/table",
      icon: Ratio,
      items: [],
    },
    {
      title: "Master Data",
      url: "/admin/master-data",
      icon: Archive,
      items: [],
    },
    {
      title: "User",
      url: "/admin/user",
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
      title: "Inventory",
      icon: Warehouse,
      url: "#",
      items: [
        { title: "Receiving", url: "/admin/receiving" },
        { title: "Shipping", url: "/admin/shipping" },
        { title: "Stock list", url: "/admin/stock-list" },
        { title: "Purchase Return", url: "/admin/purchase-return" },
      ],
    },
    {
      title: "Product",
      url: "/admin/product",
      icon: BookMarked,
      items: [],
    },
    {
      title: "Order",
      url: "/order",
      icon: FileText,
      items: [],
    },
    {
      title: "Table",
      url: "/admin/table",
      icon: Ratio,
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
