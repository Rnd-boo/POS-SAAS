"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableMapManagement from "./table-map/table-map";
import TableLayout from "./table-layout/table-layout";

export default function TableManagement() {
  return (
    <div className="w-full">
      <Tabs defaultValue="table-map">
        <div className="flex flex-col justify-end lg:flex-row w-full">
          <TabsList>
            <TabsTrigger value="table-map">Table Map</TabsTrigger>
            <TabsTrigger value="table-layout">Table Layout</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="table-map">
          <TableMapManagement />
        </TabsContent>
        <TabsContent value="table-layout">
          <TableLayout />
        </TabsContent>
      </Tabs>
    </div>
  );
}
