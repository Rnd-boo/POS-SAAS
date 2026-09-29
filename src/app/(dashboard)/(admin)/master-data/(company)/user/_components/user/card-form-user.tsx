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
import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import CreateButton from "@/components/common/create-button";
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
import FormStatusSwitch from "@/components/common/form/form-status-switch";
import FormMultiselect from "@/components/common/form/form-multiselect";

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

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            event.target instanceof HTMLInputElement
          ) {
            event.preventDefault();
          }
        }}
        className="w-full pb-28"
      >
        <div>
          <Card>
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
              {type === "Detail" ? (
                <div />
              ) : (
                <FormInput
                  form={form}
                  label="Password Hashed"
                  name="password_hash"
                  isLoading={isLoading}
                  required
                  type="password"
                  tooltip={passwordTooltip}
                />
              )}
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
                isLoading={isLoadingRoles || isLoading}
                disabled={type === "Detail"}
                required
              />
              <div />
              <div className="col-span-2">
                <FormMultiselect
                  form={form}
                  name="client_branches"
                  label="Branch Access"
                  items={branches ?? []}
                  disabled={type === "Detail"}
                  isLoading={isLoading}
                  required
                  valueKey="branch_id"
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
