import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Tables from "./tables";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import DrawerTableLayout from "./drawer-table-layout";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TableLayoutForm,
  tableLayoutFormSchema,
} from "@/validations/(pos)/table.validation";
import { Form } from "@/components/ui/form";
import {
  applyNodeChanges,
  Node,
  OnNodesChange,
  ReactFlowProvider,
  useNodesState,
} from "@xyflow/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import { INITIAL_TABLE_LAYOUT } from "@/constants/(pos)/table.constant";

export default function TableLayout() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);

  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedTableMap, setSelectedTableMap] = useState<string>("");
  const [fitViewTrigger, setFitViewTrigger] = useState<boolean>(false);
  const { setOpen } = useSidebar();
  const [edit, setEdit] = useState(false);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const form = useForm<TableLayoutForm>({
    resolver: zodResolver(tableLayoutFormSchema),
    defaultValues: { tables: [INITIAL_TABLE_LAYOUT] },
  });
  const { control, setValue, watch } = form;

  const { fields, append, replace, update, remove } = useFieldArray({
    control,
    name: "tables",
  });

  const { data: branch, isLoading } = useBranchQuery();

  const { data: tableMap } = useQuery({
    queryKey: ["table_map", currentId, selectedBranch, currentBrandId],
    queryFn: async () => {
      const result = await supabase
        .from("table_map")
        .select("id,name,branch_id")
        .eq("status", true)
        .eq("brand_id", currentBrandId)
        .eq("branch_id", Number(selectedBranch))
        .eq("clients_id", currentId);

      if (result.error)
        toast.error("Get table Data Failed", {
          description: result.error.message,
        });

      return result?.data;
    },
    enabled: !!currentId && !!currentBrandId,
  });

  useEffect(() => {
    if (currentBrandId) {
      setSelectedBranch("");
      setSelectedTableMap("");
      if (edit) {
        handleDiscard();
      }
    }
  }, [currentBrandId]);

  const { data: tables, refetch } = useQuery({
    queryKey: ["tables", currentId, selectedTableMap],
    queryFn: async () => {
      if (!selectedTableMap) return [];

      const result = await supabase
        .from("table")
        .select(
          "id,name,status,position_x,width,height,position_y,capacity,shape"
        )
        .eq("clients_id", currentId)
        .eq("table_map_id", selectedTableMap);

      if (result.error)
        toast.error("Get table Data Failed", {
          description: result.error.message,
        });
      replace(result?.data ?? []);
      return result?.data ?? [];
    },
    enabled: !!currentId && !!selectedTableMap,
  });
  const [nodes, setNodes] = useNodesState<Node>([]);

  const mappedFields = fields?.map((field) => ({
    id: field.id,
    type: "tableNode",
    position: { x: field.position_x, y: field.position_y },
    data: {
      id: field.id,
      name: field.name,
      capacity: field.capacity,
      shape: field.shape,
      status: field.status,
      width: field.width,
      height: field.height,
    },
  }));

  useEffect(() => {
    setNodes(mappedFields ?? []);
  }, [fields]);

  const onNodesChange = useCallback(
    (changes: any) => {
      if (!edit) return;

      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds);
        setTimeout(() => {
          const draggedNode = changes.filter(
            (c: any) => c.type === "position" && c.position
          );
          draggedNode.forEach((change: any) => {
            const node = updated.find((n) => n.id === change.id);
            if (!node) return;

            const index = updated.indexOf(node);

            setValue(
              `tables.${index}.position_x`,
              Math.round(node.position.x),
              {
                shouldDirty: true,
              }
            );
            setValue(
              `tables.${index}.position_y`,
              Math.round(node.position.y),
              {
                shouldDirty: true,
              }
            );
          });
        }, 0);

        const removedNodes = changes
          .filter((c: any) => c.type === "remove")
          .map((c: any) => c.id);
        removedNodes.forEach((id: string) => {
          const index = nds.findIndex((n) => n.id === id);
          if (index !== -1) {
            remove(index);
            setSelectedNode(null);
          }
        });

        const selectChange = changes.find(
          (c: any) => c.type === "select" && c.selected
        );
        if (selectChange) {
          if (selectChange.selected) {
            const selectedIndex = updated.findIndex(
              (n) => n.id === selectChange.id
            );
            setSelectedNode(selectedIndex !== -1 ? selectedIndex : null);
          } else {
            setSelectedNode(null);
          }
        }
        return updated;
      });
    },
    [setNodes, setValue, edit]
  );

  const onSubmit = async (data: TableLayoutForm) => {
    console.log("Form data:", data);

    try {
      toast.success("Tables saved successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to save tables");
      console.error(error);
    }
  };

  const handleAddTable = useCallback(() => {
    const newTable = {
      id: crypto.randomUUID(),
      name: `New Table`,
      position_x: Math.floor(Math.random() * 600),
      position_y: Math.floor(Math.random() * 400),
      capacity: 0,
      shape: "rectangle",
      width: 80,
      height: 80,
      status: "true",
    };
    append(newTable);

    setNodes(mappedFields);
    const newIndex = fields.length;
    setSelectedNode(newIndex);
  }, [fields, append, setNodes]);

  const handleDiscard = useCallback(() => {
    if (!tables) return;

    form.reset({ tables });

    setNodes(mappedFields ?? []);
    setSelectedNode(null);
    setEdit(false);

    toast.info("Changes discarded");

    setFitViewTrigger((prev) => !prev);
  }, [tables, form, setNodes]);

  return (
    <Card>
      <CardContent>
        <ReactFlowProvider>
          <h1 className="font-semibold text-2xl px-2">Table Layout</h1>
          <div className="w-full flex justify-between mt-4">
            <div className="flex gap-2">
              <Select
                value={selectedBranch}
                disabled={edit}
                onValueChange={(value) => {
                  setSelectedBranch(value);
                  setSelectedTableMap("");
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branch?.map((item) => (
                    <SelectItem key={`branch-${item.id}}`} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedTableMap}
                disabled={!selectedBranch || edit}
                onValueChange={(value) => setSelectedTableMap(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Table Map" />
                </SelectTrigger>
                <SelectContent>
                  {tableMap?.length === 0 ? (
                    <SelectItem disabled key="no-table" value="no-table">
                      No table map available
                    </SelectItem>
                  ) : (
                    tableMap?.map((item) => (
                      <SelectItem key={`table-map-${item.id}`} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {edit === true && (
                <>
                  <Button variant="outline" onClick={handleDiscard}>
                    Discard
                  </Button>
                  <Button type="button" onClick={form.handleSubmit(onSubmit)}>
                    Save Changes
                  </Button>
                </>
              )}
              <Form {...form}>
                <Drawer
                  direction="left"
                  modal={false}
                  open={edit}
                  onOpenChange={setEdit}
                  dismissible={false}
                >
                  <DrawerTrigger asChild>
                    <Button
                      size="icon"
                      disabled={selectedTableMap === ""}
                      onClick={() => {
                        setEdit((prev) => !prev);
                        setOpen(true);
                      }}
                      className={cn(edit ? "hidden" : "flex")}
                    >
                      <SquarePen />
                    </Button>
                  </DrawerTrigger>
                  <DrawerTableLayout
                    form={form}
                    handleAddTable={handleAddTable}
                    selectedIndex={selectedNode}
                    tables={watch("tables")}
                    fields={fields}
                  />
                </Drawer>
              </Form>
            </div>
          </div>
          <Form {...form}>
            <div className="w-full h-[70vh] border rounded-lg mt-4 ">
              <Tables
                enabled={edit}
                setSelectedIndex={setSelectedNode}
                selectedTableMap={selectedTableMap}
                fields={nodes}
                handleNodesChange={onNodesChange}
                fitViewTrigger={fitViewTrigger}
              />
            </div>
          </Form>
        </ReactFlowProvider>
      </CardContent>
    </Card>
  );
}
