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
import { FormEvent, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import CreateButton from "@/components/common/create-button";

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import FormSelect from "@/components/common/form/form-select";
import { STATUS_LIST } from "@/constants/general.constant";
import { UserForm } from "@/validations/user/user.validation";
import FormSelectData from "@/components/common/form/form-select-data";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShieldQuestionMark } from "lucide-react";

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
  //   const status = form.watch("status") === "true" ? "true" : "false";
  const passwordTooltip = (
    <Tooltip>
      <TooltipTrigger>
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
                label="Name"
                name="name"
                isLoading={isLoading}
                disabled={type === "Detail"}
                required
              />
              <FormSelectData
                form={form}
                label="User Role"
                name="roles_id"
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
                tooltip={passwordTooltip}
              />
              <FormSelectData
                form={form}
                label="Branch Access"
                name="user_branches"
                isLoading={isLoading}
                disabled={type === "Detail"}
                className="col-span-2"
                required
              />
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

        <CreateButton type={type} isPending={isPending} />
      </form>
    </Form>
  );
}
