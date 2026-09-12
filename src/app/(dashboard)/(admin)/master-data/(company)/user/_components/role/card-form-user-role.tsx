"use client";

import FormInput from "@/components/common/form/form-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { RolesForm } from "@/validations/user/role.validation";
import { FormEvent, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import FormRolePermission from "./form-role-permission";
import CreateButton from "@/components/common/create-button";
import { Button } from "@/components/ui/button";
import { ClipboardPaste } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DialogImportRole from "./dialog-import-role";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import FormSelect from "@/components/common/form/form-select";
import { STATUS_LIST } from "@/constants/general.constant";

export default function CardFormUserRole({
  form,
  type,
  isPending,
  isLoading,
  onSubmit,
}: {
  form: UseFormReturn<RolesForm>;
  type: "Detail" | "Create" | "Update";
  isPending?: boolean;
  isLoading?: boolean;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const status = form.watch("status") === "true" ? "true" : "false";

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full pb-28">
        <div className={cn(type !== "Create" ? "flex gap-2" : "")}>
          <Card className={cn(type !== "Create" ? "w-3/4 mb-2" : "w-full")}>
            <CardHeader>
              <CardTitle>{type} Role</CardTitle>
              <CardDescription>
                Manage role - {type} information as needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <FormInput
                form={form}
                label="Role Name"
                name="name"
                className="w-full mr-2"
                isLoading={isLoading}
                disabled={type === "Detail"}
              />
              {type !== "Detail" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => setOpen(true)} type="button">
                      <ClipboardPaste />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Import from existing Role</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </CardContent>
          </Card>
          {type !== "Create" && (
            <Card className="w-1/4 h-fit">
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label>Status</Label>
                  {type === "Detail" ? (
                    isLoading ? (
                      <Skeleton className="h-9 rounded-full w-[144px]" />
                    ) : (
                      <div
                        className={cn(
                          "px-2 py-1 rounded-full text-white w-fit capitalize text-sm",
                          status === "true" ? "bg-green-600" : "bg-destructive",
                        )}
                      >
                        {status === "true" ? "Active" : "Inactive"}
                      </div>
                    )
                  ) : (
                    <FormSelect
                      form={form}
                      name="status"
                      selectItem={STATUS_LIST}
                      isLoading={isLoading}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <Card>
          <CardContent>
            <FormRolePermission form={form} type={type} />
          </CardContent>
        </Card>
        <CreateButton type={type} isPending={isPending} />
      </form>
      <DialogImportRole open={open} setOpen={setOpen} form={form} />
    </Form>
  );
}
