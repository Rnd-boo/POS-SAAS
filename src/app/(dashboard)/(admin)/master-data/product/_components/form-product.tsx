"use client";

import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { STATUS_LIST } from "@/constants/general.constant";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormProduct<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
}) {
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);

  console.log("🔍 Form Debug:", {
    isValid: form.formState.isValid,
    errors: form.formState.errors,
    values: form.getValues(),
  });

  const { data: categoriesResult } = useQuery({
    queryKey: ["categories", currentId],
    queryFn: async () => {
      const result = await supabase
        .from("categories")
        .select("id, name")
        .eq("status", true)
        .eq("clients_id", currentId);
      return result;
    },
    enabled: !!currentId,
  });
  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle>{type} Product</DialogTitle>
          <DialogDescription>
            {type === "Create"
              ? "Add a new Product"
              : "Make a changes this Product"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 ">
          <div className="space-y-4 max-h-[50vh] overflow-y-auto px-1">
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
              data={categoriesResult?.data ?? undefined}
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
            <FormInput
              form={form}
              name={"description" as Path<T>}
              label="Description"
              placeholder="Optional"
              type="textarea"
            />
            <FormSelect
              form={form}
              name={"status" as Path<T>}
              label="Status"
              selectItem={STATUS_LIST}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isLoading ? <Loader2 className="animate-spin" /> : type}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
