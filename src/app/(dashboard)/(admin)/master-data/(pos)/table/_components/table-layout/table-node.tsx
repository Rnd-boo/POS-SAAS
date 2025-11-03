import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

export default function TableNode({
  data,
  selected,
}: {
  selected: boolean;
  data: {
    name: string;
    capacity: number;
    shape: string;
    status: boolean;
    width: number;
    height: number;
  };
}) {
  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn(
          "flex items-center justify-center  bg-primary/90 text-foreground",
          data.shape === "circle" ? "rounded-full" : "rounded-sm",
          selected ? "ring-2 ring-[#4749b6] dark:ring-[#595be8]" : ""
        )}
        style={{
          width: `${data.width}px`,
          height: `${data.height}px`,
        }}
      >
        {data?.name}
      </HoverCardTrigger>
      <HoverCardContent className="w-36">
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold">Table {data.name}</h4>
          <p className="text-xs text-muted-foreground">
            Capacity: {data.capacity}
          </p>
          <p className="text-xs text-muted-foreground">
            Status: {data.status === true || "true" ? "Active" : "Inactive"}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
