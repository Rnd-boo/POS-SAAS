"use client";

import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/common/page-header";
import { DataTable } from "@/components/common/tanstack-table";
import { User } from "@/validations/user/user.validation";
import { UserColumn, userColumns } from "@/components/columns.tsx/user-columns";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function UserManagement() {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);
  const pathname = usePathname();
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
        .select(`id,name,username,roles!roles_id(name),status,password_hash`, {
          count: "exact",
        })
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId)
        .range((currentPage - 1) * 10, currentPage * 10 - 1)
        .order("name")
        .ilike("name", `%${currentSearch}%`);

      const result = await query.overrideTypes<UserColumn[]>();

      if (result.error)
        toast.error("Get Table Map Data Failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!currentId,
  });

  // const [selectedAction, setSelectedAction] = useState<{
  //   data: TableMap;
  //   type: "detail" | "update" | "delete";
  // } | null>(null);

  // const handleChangeAction = (open: boolean) => {
  //   if (!open) setSelectedAction(null);
  // };

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
          columns={userColumns}
          totalPages={totalPages}
          currentPage={currentPage}
          onChangePage={handleChangePage}
        />
      </CardContent>
    </Card>
  );
}
