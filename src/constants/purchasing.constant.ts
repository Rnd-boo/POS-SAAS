import { ShoppingBasket, ShoppingCartPlus } from "lucide-react";

export const PURCHASING_CARD = [
  {
    title: "Purchase Request",
    url: "/purchasing/requests",
    icon: ShoppingBasket,
    disabled: true,
    description:
      "Submit internal requests for items needed at your branch, for review before converting into a purchase order.",
  },
  {
    title: "Purchase Order",
    url: "/purchasing/orders",
    icon: ShoppingCartPlus,
    description:
      "Create and manage orders sent to suppliers, from draft through approval and receiving.",
  },
];
