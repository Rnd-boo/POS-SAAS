import {
  ClipboardCheck,
  ClipboardCopy,
  ClipboardPlus,
  ClipboardX,
 
} from "lucide-react";

export const PRODUCTION_CARD = [
      {
        title: "Production Order",
        icon: ClipboardPlus,
        url: "/production/order",
        description:
          "Plan and track the production planning (Demand forecasting).",
      },
      {
        title: "Production Process",
        icon: ClipboardCopy,
        url: "/production/process",
        description:
          "Execute and monitor production activities.",
      },
      {
        title: "Production Confirmation",
        url: "/production/confirmation",
        icon: ClipboardCheck,
        description: "Confirm completed production results for finished goods and consumed materials.",
      },
      {
        title: "Production Close",
        url: "/production/close",
        icon: ClipboardX,
        description:
          "Finalize the production order by closing all remaining qty and locking further changes.",
      },
    ]