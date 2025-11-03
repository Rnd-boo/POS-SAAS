"use client";

import "@xyflow/react/dist/style.css";
import { Background, Node, ReactFlow, useReactFlow } from "@xyflow/react";
import TableNode from "./table-node";
import { useEffect } from "react";

export default function Tables({
  fields,
  selectedTableMap,
  fitViewTrigger,
  setSelectedIndex,
  handleNodesChange,
  enabled,
}: {
  selectedTableMap: string;
  setSelectedIndex: (index: number | null) => void;
  fitViewTrigger: boolean;
  fields: Node[];
  handleNodesChange: (changes: any) => void;
  enabled: boolean;
}) {
  const nodeTypes = { tableNode: TableNode };
  const { fitView } = useReactFlow();
  useEffect(() => {
    fitView({ duration: 300, padding: 0.1 });
  }, [fitViewTrigger, fitView]);

  return (
    <>
      {selectedTableMap === "" ? (
        <div className="flex h-full w-full items-center justify-center">
          Please select table map
        </div>
      ) : (
        <ReactFlow
          nodes={fields}
          panOnDrag={enabled}
          zoomOnScroll={enabled}
          nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          onPaneClick={() => setSelectedIndex(null)}
          proOptions={{ hideAttribution: true }}
          nodesConnectable={false}
          nodeExtent={[
            [0, 0],
            [1800, 800],
          ]}
          translateExtent={[
            [0, 0],
            [1800, 800],
          ]}
          minZoom={0.55}
          maxZoom={1.6}
          fitView
          fitViewOptions={{ padding: 0.1 }}
        >
          <Background />
        </ReactFlow>
      )}
    </>
  );
}
