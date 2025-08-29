"use client";

import DialogInformation from "@/components/common/dialog-information";
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
import { FormEvent, useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormDetail<T extends FieldValues>({
  form,
  onSubmit,
  isLoading = false,
  fields,
}: {
  form: UseFormReturn<T>;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  fields: { label: string; value: string | number | undefined }[];
}) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return (
    <Card className="w-full">
      <Form {...form}>
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle className="text-xl">Detail Product</CardTitle>
          </div>
          <Button
            type="button"
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            View Information
          </Button>
        </CardHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <CardContent className="space-y-5 max-h-[50vh] px-6 grid grid-cols-2 gap-x-5">
            <FormInput
              form={form}
              name={"name" as Path<T>}
              label="Product"
              placeholder="Insert Product name"
              disabled
            />
            <FormInput
              form={form}
              name={"categories_id" as Path<T>}
              label="Category"
              disabled
            />
            <FormInput
              form={form}
              name={"upc" as Path<T>}
              label="Product Code"
              placeholder="Insert Product code"
              type="text"
              disabled
            />
            <FormSelect
              form={form}
              name={"status" as Path<T>}
              label="Status"
              selectItem={STATUS_LIST}
              disabled
            />
            <FormInput
              form={form}
              name={"description" as Path<T>}
              label="Description"
              placeholder="Optional"
              type="textarea"
              disabled
            />
          </CardContent>
        </form>
      </Form>
      <DialogInformation
        open={openDialog}
        onOpenChange={setOpenDialog}
        isLoading={isLoading}
        title="Product"
        fields={fields}
      />
      <Separator />
      <CardContent></CardContent>
      <CardFooter className="justify-end flex gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </CardFooter>
    </Card>
  );
}
