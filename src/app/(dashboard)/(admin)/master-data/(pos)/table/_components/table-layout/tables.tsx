"use client";

import "@xyflow/react/dist/style.css";
import { Background, Node, ReactFlow, useReactFlow } from "@xyflow/react";
import TableNode from "./table-node";
import { useEffect } from "react";
import { useWatch } from "react-hook-form";

export default function Tables({
  fields,
  selectedTableMap,
  fitViewTrigger,
  setSelectedIndex,
  handleNodesChange,
  enabled,
  control,
  setNodes,
}: {
  selectedTableMap: string;
  setSelectedIndex: (index: number | null) => void;
  fitViewTrigger: boolean;
  fields: Node[];
  handleNodesChange: (changes: any) => void;
  enabled: boolean;
  control: any;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}) {
  const tables = useWatch({ control, name: "tables" });
  const nodeTypes = { tableNode: TableNode };
  const { fitView } = useReactFlow();
  useEffect(() => {
    fitView({ duration: 300, padding: 0.1 });
  }, [fitViewTrigger, fitView]);

  const handleInit = () => {
    setTimeout(() => {
      fitView({ duration: 300, padding: 0.1 });
    }, 200);
  };

  useEffect(() => {
    if (!tables || !tables.length) return;

    setNodes((nodes) =>
      nodes.map((node, i) => {
        const t = tables[i];
        if (!t) return node;

        return {
          ...node,
          data: {
            ...node.data,
            name: t.name ?? node.data.name,
            width: Number(t.width ?? node.data.width),
            height: Number(t.height ?? node.data.height),
            shape: t.shape ?? node.data.shape,
          },
          position: {
            x: Number(t.position_x ?? node.position.x),
            y: Number(t.position_y ?? node.position.y),
          },
        };
      })
    );
  }, [tables]);

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
            [1280, 600],
          ]}
          translateExtent={[
            [0, 0],
            [1280, 600],
          ]}
          minZoom={0.65}
          maxZoom={1.6}
          onInit={handleInit}
        >
          <Background />
        </ReactFlow>
      )}
    </>
  );
}
