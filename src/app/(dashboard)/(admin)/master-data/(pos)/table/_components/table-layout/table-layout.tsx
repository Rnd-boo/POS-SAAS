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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Tables from "./tables";
import { Button } from "@/components/ui/button";
import { CirclePlus, SquarePen } from "lucide-react";

export default function TableLayout() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);

  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedTableMap, setselectedTableMap] = useState<string>("");

  const { data: branch } = useQuery({
    queryKey: ["branch", currentId, currentBrandId],
    queryFn: async () => {
      const result = await supabase
        .from("branch")
        .select("id,name")
        .eq("status", true)
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId);

      if (result.error)
        toast.error("Get Branch Data Failed", {
          description: result.error.message,
        });

      return result?.data;
    },
    enabled: !!currentId && !!currentBrandId,
  });

  const { data: tableMap } = useQuery({
    queryKey: ["table_map", currentId, selectedBranch, currentBrandId],
    queryFn: async () => {
      const result = await supabase
        .from("table_map")
        .select("id,name,branch_id")
        .eq("status", true)
        .eq("brand_id", currentBrandId)
        .eq("clients_id", currentId);

      if (result.error)
        toast.error("Get table Data Failed", {
          description: result.error.message,
        });

      return result?.data;
    },
    enabled: !!currentId && !!currentBrandId,
  });

  const tableChange = tableMap?.filter(
    (item) => item.branch_id === selectedBranch
  );

  useEffect(() => {
    if (currentBrandId) {
      setSelectedBranch("");
      setselectedTableMap("");
    }
  }, [currentBrandId]);

  useEffect(() => {
    setselectedTableMap("");
  }, [selectedBranch]);

  return (
    <Card>
      <CardContent>
        <h1 className="font-semibold text-2xl px-2">Table Layout</h1>
        <div className="w-full flex justify-between mt-4">
          <div className="flex gap-2">
            <Select
              key={`branch-${currentBrandId}`}
              onValueChange={(value) => setSelectedBranch(value)}
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
              key={`table-map-${currentBrandId}-${selectedBranch}`}
              disabled={selectedBranch === ""}
              onValueChange={(value) => setselectedTableMap(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Table Map" />
              </SelectTrigger>
              <SelectContent>
                {tableChange?.length === 0 ? (
                  <SelectItem disabled key="no-table" value="no-table">
                    No table map available
                  </SelectItem>
                ) : (
                  tableChange?.map((item) => (
                    <SelectItem key={`table-map-${item.id}`} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button size="icon" disabled={selectedTableMap === ""}>
              <SquarePen />
            </Button>
            <Button size="icon" disabled={selectedTableMap === ""}>
              <CirclePlus />
            </Button>
          </div>
        </div>
        <div className="w-full h-[70vh] border rounded-lg mt-4 ">
          <Tables selectedTableMap={selectedTableMap} />
        </div>
      </CardContent>
    </Card>
  );
}
