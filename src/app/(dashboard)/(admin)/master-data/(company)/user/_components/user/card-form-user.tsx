"use client";

import FormInput from "@/components/common/form/form-input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormEvent, useEffect, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import CreateButton from "@/components/common/create-button";
import { cn } from "@/lib/utils";
import { UserForm } from "@/validations/user/user.validation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShieldQuestionMark } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useBrandStore } from "@/stores/brand-store";
import { useAuthStore } from "@/stores/auth-store";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import FormCombobox from "@/components/common/form/form-combobox";
import FormMultipleCombobox, {
  comboboxType,
} from "@/components/common/form/form-multiple-combobox";
import FormStatusSwitch from "@/components/common/form/form-status-switch";

const passwordTooltip = (
  <Tooltip>
    <TooltipTrigger asChild>
      <ShieldQuestionMark className="size-4 text-primary" />
    </TooltipTrigger>
    <TooltipContent>
      <p>
        Password will be hashed, make sure to write it down somewhere safe
        before submit
      </p>
    </TooltipContent>
  </Tooltip>
);

export default function CardFormUser({
  form,
  type,
  isPending,
  isLoading,
  onSubmit,
}: {
  form: UseFormReturn<UserForm>;
  type: "Detail" | "Create" | "Update";
  isPending?: boolean;
  isLoading?: boolean;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentId = useAuthStore((state) => state.profile?.clients);
  const { data: branches } = useBranchQuery();
  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles", currentId, currentBrandId],
    queryFn: async () => {
      const result = await supabase
        .from("roles")
        .select("id,name", {
          count: "exact",
        })
        .eq("clients_id", currentId)
        .eq("brand_id", currentBrandId);

      return result;
    },
    enabled: !!currentId,
    staleTime: 5 * 60 * 1000,
  });

  const [branchValue, branchSetValue] = useState<comboboxType[]>([]);
  const { replace } = useFieldArray({
    control: form.control,
    name: "client_branches",
  });
  useEffect(() => {
    replace(
      branchValue.map((v) => ({
        branch_id: String(v.id),
      })),
    );
  }, [branchValue, replace]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full pb-28">
        <div className={cn(type !== "Create" ? "flex gap-2" : "")}>
          <Card className={cn(type !== "Create" ? "w-3/4 mb-2" : "w-full")}>
            <CardHeader>
              <CardTitle>{type} User</CardTitle>
              <CardDescription>
                Manage user - {type} information as needed.
              </CardDescription>
              <CardAction>
                <FormStatusSwitch
                  form={form}
                  name="status"
                  disabled={type === "Detail"}
                />
              </CardAction>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 gap-y-6">
              <FormInput
                form={form}
                label="Username"
                name="username"
                isLoading={isLoading}
                disabled={type === "Detail"}
                required
              />
              <FormInput
                form={form}
                label="Password Hashed"
                name="password_hash"
                isLoading={isLoading}
                disabled={type === "Detail"}
                required
                type="password"
                tooltip={passwordTooltip}
              />
              <div />
              <FormInput
                form={form}
                label="Full Name"
                name="name"
                isLoading={isLoading}
                disabled={type === "Detail"}
                required
              />
              <FormCombobox
                form={form}
                items={roles?.data ?? []}
                label="User Role"
                name="roles_id"
                isLoading={isLoadingRoles}
                disabled={type === "Detail"}
                required
              />

              <div className="col-span-2">
                <FormMultipleCombobox
                  form={form}
                  label="Branch Access"
                  name="client_branches"
                  items={branches ?? []}
                  setValue={branchSetValue}
                  value={branchValue}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <CreateButton type={type} isPending={isPending} />
      </form>
    </Form>
  );
}
