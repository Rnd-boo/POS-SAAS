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
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";
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
} from "@/validations/pos/table.validation";
import { Form } from "@/components/ui/form";
import {
  applyNodeChanges,
  Node,
  ReactFlowProvider,
  useNodesState,
} from "@xyflow/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import {
  INITIAL_STATE_TABLE_LAYOUT,
  INITIAL_TABLE_LAYOUT,
} from "@/constants/pos/table.constant";
import { tablesAction } from "../../action";

export default function TableLayout() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);

  const [nodes, setNodes] = useNodesState<Node>([]);

  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedTableMap, setSelectedTableMap] = useState<string>("");
  const [fitViewTrigger, setFitViewTrigger] = useState<boolean>(false);
  const { setOpen } = useSidebar();
  const [edit, setEdit] = useState(false);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const form = useForm<TableLayoutForm>({
    resolver: zodResolver(tableLayoutFormSchema),
    defaultValues: { tables: [INITIAL_TABLE_LAYOUT] },
    mode: "onChange",
  });
  const { control, setValue } = form;

  const { fields, append, replace, remove } = useFieldArray({
    control,
    name: "tables",
  });
  const { data: branch } = useBranchQuery();

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
            (c: any) =>
              ((c.type === "position" || c.type === "selected") &&
                c.position) ||
              c.selected
          );

          draggedNode.forEach((change: any) => {
            const node = updated.find((n) => n.id === change.id);
            if (!node) return;

            const idx = fields.findIndex((f) => f.id === node.id);
            if (idx === -1) return;

            setSelectedNode(idx);

            setValue(`tables.${idx}.position_x`, Math.round(node.position.x), {
              shouldDirty: true,
            });
            setValue(`tables.${idx}.position_y`, Math.round(node.position.y), {
              shouldDirty: true,
            });
          });
        }, 0);

        return updated;
      });
    },
    [setNodes, setValue, edit, fields]
  );

  const handleAddTable = useCallback(() => {
    const newTable = {
      id: crypto.randomUUID(),
      name: `New Table`,
      position_x: Math.floor(Math.random() * 400),
      position_y: Math.floor(Math.random() * 200),
      capacity: 1,
      shape: "rectangle",
      width: 80,
      height: 80,
      status: "true",
    };
    append(newTable);

    setNodes(mappedFields);
    setSelectedNode(fields.length);
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

  const [tableLayoutState, tableLayoutAction, isPendingTableLayout] =
    useActionState(tablesAction, INITIAL_STATE_TABLE_LAYOUT);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("tables", JSON.stringify(data.tables));

    formData.append("table_map_id", selectedTableMap);

    startTransition(() => {
      tableLayoutAction(formData);
    });
  });

  useEffect(() => {
    if (tableLayoutState?.status === "error") {
      toast.error("Failed to save tables", {
        description: tableLayoutState.errors?._form?.[0],
      });
    }
    if (tableLayoutState?.status === "success") {
      toast.success("Tables saved successfully");
      form.reset();
      refetch();
      setEdit(false);
      setFitViewTrigger((prev) => !prev);
    }
  }, [tableLayoutState]);

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
                  <Button type="button" onClick={onSubmit}>
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
                    remove={remove}
                    handleAddTable={handleAddTable}
                    selectedIndex={selectedNode}
                    fields={fields}
                  />
                </Drawer>
              </Form>
            </div>
          </div>
          <Form {...form}>
            <div className="w-full h-[70vh] border rounded-lg mt-4 ">
              <Tables
                isPending={isPendingTableLayout}
                setNodes={setNodes}
                enabled={edit}
                control={control}
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
