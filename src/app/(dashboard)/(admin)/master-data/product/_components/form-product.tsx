"use client";

import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { STATUS_LIST } from "@/constants/general.constant";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import FormProductUnit from "./form-product-unit";

export default function FormProduct<T extends FieldValues>({
  form,
  onSubmit,
  isLoading = false,
  type,
}: {
  form: UseFormReturn<T>;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  type: "Create" | "Update";
}) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);

  const router = useRouter();

  const { data: categoriesResult } = useQuery({
    queryKey: ["categories", currentId],
    queryFn: async () => {
      const result = await supabase
        .from("categories")
        .select("id, name")
        .eq("status", true)
        .eq("clients_id", currentId);
      return result?.data;
    },
    enabled: !!currentId,
  });

  const { data: units } = useQuery({
    queryKey: ["units", currentId],
    queryFn: async () => {
      const result = await supabase
        .from("units")
        .select("id,name")
        .eq("status", true)
        .eq("clients_id", currentId);
      return result?.data;
    },
    enabled: !!currentId,
  });

  return (
    <Card className="w-full">
      <Form {...form}>
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle className="text-xl">{type} Product</CardTitle>
            <CardDescription>
              {type === "Create"
                ? "Add a new Product"
                : "Make a changes this Product"}
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <CardContent className="space-y-5 max-h-[50vh] px-6 grid grid-cols-2 gap-x-5">
            <FormInput
              form={form}
              name={"name" as Path<T>}
              label="Product"
              placeholder="Insert Product name"
            />
            <FormSelect
              form={form}
              name={"categories_id" as Path<T>}
              label="Category"
              data={categoriesResult ?? undefined}
              valueKey="id"
              labelKey="name"
            />
            <FormInput
              form={form}
              name={"upc" as Path<T>}
              label="Product Code"
              placeholder="Insert Product code"
              type="text"
            />
            <FormSelect
              form={form}
              name={"status" as Path<T>}
              label="Status"
              selectItem={STATUS_LIST}
            />
            <FormInput
              form={form}
              name={"description" as Path<T>}
              label="Description"
              placeholder="Optional"
              type="textarea"
            />
          </CardContent>
          <Separator />
          <CardHeader className="flex justify-between">
            <CardTitle className="text-lg">Product Units</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <FormProductUnit form={form} units={units ?? undefined} />
          </CardContent>
          <CardFooter className="justify-end flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isLoading ? <Loader2 className="animate-spin" /> : type}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
