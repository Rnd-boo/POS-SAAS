"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "./_components/user/user";
import UserRoleManagement from "./_components/role/user-role";
import { useState } from "react";
export default function TableManagement() {
  let initialTab = "user";
  const [value, setValue] = useState(initialTab);
  return (
    <div className="w-full ">
      <Tabs defaultValue={initialTab} value={value} onValueChange={setValue}>
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-medium">User Management</h1>
          <TabsList>
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="role">Role</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="user">
          <UserManagement />
        </TabsContent>
        <TabsContent value="role">
          <UserRoleManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
