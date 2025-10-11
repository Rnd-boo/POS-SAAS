import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

export default function TableNode({
  data,
}: {
  data: { label: string; capacity: number; shape: string; status: boolean };
}) {
  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn(
          "w-24 h-24 flex items-center justify-center outline-2 bg-ungu text-foreground",
          {
            "rounded-full ": data.shape === "circle",
            "rounded-sm w-80 h-48 ": data.shape === "rectangle",
          }
        )}
      >
        {data?.label}
      </HoverCardTrigger>
      <HoverCardContent className="w-36">
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold">Table {data.label}</h4>
          <p className="text-xs text-muted-foreground">
            Capacity: {data.capacity}
          </p>
          <p className="text-xs text-muted-foreground">
            Status: {data.status === true ? "Active" : "Inactive"}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
