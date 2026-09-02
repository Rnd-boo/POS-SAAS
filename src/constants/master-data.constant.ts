import {
  BookA,
  BookText,
  ClipboardPenLine,
  DatabaseBackup,
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
        description: "Manage brand branches or store locations.",
      },
      {
        title: "User",
        url: "/master-data/user",
        icon: ShieldUser,
        description:
          "Configure user and roles to ensure secure access in system.",
      },
      {
        title: "User Role",
        url: "/master-data/user-role",
        icon: ShieldUser,
        description: "Configure user roles to ensure secure access in system.",
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
      {
        title: "Bill of Materials",
        icon: DatabaseBackup,
        url: "/master-data/bill-of-materials",
        description:
          "List of ingredients, and resources needed to assemble/manufacture a product.",
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
        description: "Manage table layouts in POS",
      },
      {
        title: "Point of Sale Users",
        url: "/master-data/pos-users",
        icon: UsersRound,
        description:
          "Control POS user access, roles, and operational permissions.",
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
