import "@xyflow/react/dist/style.css";
import { Background, ReactFlow } from "@xyflow/react";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { useMemo } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

function TableNode({
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

export default function Tables({
  selectedTableMap,
}: {
  selectedTableMap: string;
}) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);

  const { data: tables } = useQuery({
    queryKey: ["tables", currentId, selectedTableMap],
    queryFn: async () => {
      if (!selectedTableMap) return []; // always return an array, never undefined
      const result = await supabase
        .from("table")
        .select(
          "id,name,status,position_x,position_y,capacity,shape,table_map_id"
        )
        .eq("clients_id", currentId)
        .eq("table_map_id", selectedTableMap);

      if (result.error)
        toast.error("Get table Data Failed", {
          description: result.error.message,
        });

      return result?.data ?? [];
    },
    enabled: !!currentId && !!selectedTableMap,
  });

  const nodeTypes = { tableNode: TableNode };

  const initialNodes = useMemo(() => {
    return tables?.map((table) => ({
      id: table.id,
      position: { x: table.position_x, y: table.position_y },
      data: {
        label: table.name,
        capacity: table.capacity,
        shape: table.shape,
        status: table.status,
      },
      type: "tableNode",
    }));
  }, [tables]);

  return (
    <>
      {selectedTableMap === "" ? (
        <div className="flex h-full w-full items-center justify-center">
          Please select table map
        </div>
      ) : (
        <ReactFlow
          nodes={initialNodes}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          nodesConnectable={false}
          preventScrolling={false}
        >
          <Background />
        </ReactFlow>
      )}
    </>
  );
}
