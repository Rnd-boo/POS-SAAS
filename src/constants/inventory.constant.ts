import {
  Blocks,
  GalleryHorizontalEnd,
  LayoutList,
  LayoutTemplate,
  PackageCheck,
  Truck,
} from "lucide-react";

export const INVENTORY_CARD = [
  {
    title: "Stock List",
    url: "/inventory/stock-list",
    icon: LayoutList,
    description:
      "View current inventory levels for all items across locations.",
  },
  {
    title: "Stock Adjustment",
    url: "/inventory/stock-adjustment",
    icon: Blocks,
    description:
      "Update inventory quantities to reflect physical stock differences or corrections.",
  },
  {
    title: "Receiving",
    icon: PackageCheck,
    url: "/inventory/receive",
    disabled: true,
    description: "Record and confirm incoming items into inventory.",
  },
  {
    title: "Purchase Order",
    icon: PackageCheck,
    url: "/inventory/po",
    disabled: true,
    description:
      "Create and manage purchase requests for items from suppliers before receiving.",
  },
  {
    title: "Shipping",
    url: "/inventory/shipping",
    disabled: true,
    icon: Truck,
    description: "Process and record outgoing items for delivery.",
  },

  {
    title: "Item Journal",
    url: "/inventory/item-journal",
    disabled: true,
    icon: LayoutTemplate,
    description: "Record manual inventory adjustments and item movements.",
  },

  {
    title: "Inventory Transfers",
    url: "/inventory/transfers",
    disabled: true,
    icon: GalleryHorizontalEnd,
    description:
      "Move items between locations while keeping inventory records accurate.",
  },
];
