import {
  ClipboardCheck,
  ClipboardCopy,
  ClipboardPlus,
  ClipboardType,
  ClipboardX,
} from "lucide-react";

export const PRODUCTION_CARD = [
  {
    title: "Production Orders",
    icon: ClipboardPlus,
    url: "/production/orders",
    description: "Plan and track the production planning (Demand forecasting).",
  },
  {
    title: "Production Process",
    icon: ClipboardCopy,
    url: "/production/process",
    description: "Execute and monitor production activities.",
  },
  {
    title: "Production Confirmation",
    url: "/production/confirmation",
    icon: ClipboardCheck,
    description:
      "Confirm completed production results for finished goods and consumed materials.",
  },
  {
    title: "Production Close",
    url: "/production/close",
    icon: ClipboardX,
    description:
      "Finalize the production order by closing all remaining qty and locking further changes.",
  },
  {
    title: "Open Manufacturing",
    url: "/production/open-manufacturing",
    icon: ClipboardType,
    description:
      "Finalize the production order by closing all remaining qty and locking further changes.",
  },
];
