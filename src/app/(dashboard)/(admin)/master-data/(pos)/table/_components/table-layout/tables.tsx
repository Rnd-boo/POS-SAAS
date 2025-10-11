import "@xyflow/react/dist/style.css";
import { Background, ReactFlow } from "@xyflow/react";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { useMemo } from "react";
import TableNode from "./table-node";

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
