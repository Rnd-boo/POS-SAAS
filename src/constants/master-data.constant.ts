import {
  BookA,
  BookText,
  ClipboardPenLine,
  Layers,
  PackageSearch,
  Ratio,
  Ruler,
  ShieldUser,
  Tag,
  UsersRound,
  VectorSquare,
} from "lucide-react";

export const MASTER_CARD = [
  {
    title: "Company",
    description: "Manage company profile and configuration",
    contents: [
      {
        title: "Brand",
        icon: Tag,
        url: "/master-data/brand",
        description:
          "Manage company brands to represent different business identities.",
      },
      {
        title: "Branch",
        url: "/master-data/branch",
        icon: VectorSquare,
        description: "Manage company branches or store locations.",
      },
      {
        title: "User",
        url: "/master-data/user",
        icon: ShieldUser,
        description:
          "Configure user and roles to ensure secure access in system.",
      },
    ],
  },
  {
    title: "Products",
    description: "Manage your product",
    contents: [
      {
        title: "Product",
        icon: PackageSearch,
        url: "/master-data/product",
        description: "Manage your entire product catalog",
      },
      {
        title: "Category",
        icon: Layers,
        url: "/master-data/category",
        description: "Define and manage product categories",
      },
      {
        title: "Unit Of Measure",
        icon: Ruler,
        url: "/master-data/unit",
        description: "Define and manage product UOM",
      },
    ],
  },
  {
    title: "POS",
    description: "Configure your Point Of Sale settings",
    contents: [
      {
        title: "Table",
        url: "/master-data/table",
        icon: Ratio,
        description: "Manage tables in POS",
      },
      {
        title: "User POS",
        url: "/master-data/pos-user",
        icon: UsersRound,
        description: "Manage POS users ",
      },
      {
        title: "Order Context",
        url: "/master-data/order-context",
        icon: ClipboardPenLine,
        description: "Manage order purposes to classify visits",
      },
      {
        title: "Menu",
        url: "/master-data/menu",
        icon: BookText,
        description: "Configure your POS menu ",
      },
      {
        title: "Menu Category",
        icon: BookA,
        url: "/master-data/menu-category",
        description: "Manage category for POS menu ",
      },
    ],
  },
];
