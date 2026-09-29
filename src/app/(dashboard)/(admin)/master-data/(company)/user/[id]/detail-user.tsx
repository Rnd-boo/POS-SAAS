"use client";

import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import CardFormUser from "../_components/user/card-form-user";
import { UserForm, userFormSchema } from "@/validations/user/user.validation";
import { INITIAL_USER } from "@/constants/user/user.constant";
import { UserColumn } from "@/components/columns.tsx/user-columns";

export default function DetailUser() {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const params = useParams();
  const clientProfileId = params?.id as string;
  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: INITIAL_USER,
  });
  const { data: clientProfiles, isLoading: isLoadingClientProfiles } = useQuery(
    {
      queryKey: ["client_profiles", clientProfileId],

      queryFn: async () => {
        const query = supabase
          .from("client_profiles")
          .select(
            `id,name,username,roles_id,roles!client_profiles_roles_id_fkey(name),status,password_hash,client_branches(branch(id,name))`,
          )
          .eq("clients_id", currentId)
          .eq("brand_id", currentBrandId)
          .eq("id", clientProfileId)
          .single();
        const result = await query.overrideTypes<UserColumn>();

        if (result.error)
          toast.error("Get User Role Data Failed", {
            description: result.error.message,
          });
        return result.data;
      },
      enabled: !!currentId && !!clientProfileId,
    },
  );

  useEffect(() => {
    if (!clientProfiles) return;
    form.setValue("name", String(clientProfiles.name));
    form.setValue("username", String(clientProfiles.username));
    form.setValue("status", clientProfiles.status);
    form.setValue("roles_id", clientProfiles.roles_id);
    form.setValue(
      "client_branches",
      clientProfiles.client_branches.map((branch) => ({
        branch_id: String(branch.branch.id),
      })),
    );
  }, [clientProfiles, form]);
  return (
    <CardFormUser
      type="Detail"
      form={form}
      isLoading={isLoadingClientProfiles}
    />
  );
}
