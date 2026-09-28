"use client";

import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/common/page-header";
import { DataTable } from "@/components/common/tanstack-table";
import { UserColumn, userColumns } from "@/components/columns.tsx/user-columns";
import { usePathname, useRouter } from "next/navigation";
import DialogDeleteUser from "./dialog-delete-user";
import { User } from "@/validations/user/user.validation";

export default function UserManagement() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);
  const pathname = usePathname();
  const router = useRouter();
  const { currentPage, handleChangePage, currentSearch, handleChangeSearch } =
    useDataTable();

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "client_profiles",
      currentPage,
      currentSearch,
      currentId,
      currentBrandId,
    ],
    queryFn: async () => {
      const query = supabase
        .from("client_profiles")
        .select(
          `id,name,username,roles_id,roles!client_profiles_roles_id_fkey(name),status,password_hash,client_branches(branch(name))`,
          { count: "exact" },
        )
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .range((currentPage - 1) * 10, currentPage * 10 - 1)
        .order("name")
        .ilike("name", `%${currentSearch}%`);

      const result = await query.overrideTypes<UserColumn[]>();

      if (result.error)
        toast.error("Get User Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: User;
    type: "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const totalData = users?.count ?? 0;

  const totalPages = useMemo(() => {
    return users && users.count !== null ? Math.ceil(users.count / 10) : 0;
  }, [users]);

  return (
    <Card className="w-full pb-0">
      <CardContent>
        <PageHeader
          pathname={pathname}
          handleChangeSearch={handleChangeSearch}
          placeholder="Name"
        />
        <DataTable
          refetch={refetch}
          data={users?.data ?? []}
          totalData={totalData}
          columns={userColumns({
            router: router,
            pathname,
            setSelectedAction,
          })}
          totalPages={totalPages}
          currentPage={currentPage}
          onChangePage={handleChangePage}
        />
        <DialogDeleteUser
          open={selectedAction?.type === "delete"}
          refetch={refetch}
          currentData={selectedAction?.data}
          handleChangeAction={handleChangeAction}
        />
      </CardContent>
    </Card>
  );
}
