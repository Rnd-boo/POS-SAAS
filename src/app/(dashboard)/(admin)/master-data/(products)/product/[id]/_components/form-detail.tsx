"use client";

import DialogInformation from "@/components/common/dialog/dialog-information";
import FormInput from "@/components/common/form/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { FormEvent, Fragment, useState } from "react";
import {
  ArrayPath,
  FieldValues,
  Path,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { fi } from "zod/v4/locales";
import { Label } from "@/components/ui/label";
import FormSelectData from "@/components/common/form/form-select-data";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export default function FormDetail<T extends FieldValues>({
  form,
  onSubmit,
  data,
  isLoading = false,
}: {
  form: UseFormReturn<T>;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  data: { label: string; value: string | number | undefined }[];
  isLoading?: boolean;
}) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { fields } = useFieldArray({
    control: form.control,
    name: "units" as ArrayPath<T>,
  });
  const supabase = createClient();

  const { data: categoriesResult } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await supabase
        .from("categories")
        .select("id, name")
        .eq("status", true);
      return result?.data;
    },
  });
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
          {isLoading ? (
            <CardContent className="max-h-[50vh] px-6 space-y-5 grid grid-cols-2 gap-x-8 text-sm">
              <div>
                <p>Product</p>
                <Skeleton className="h-9" />
              </div>
              <div>
                <p>Category</p>
                <Skeleton className="h-9" />
              </div>
              <div>
                <p>Product Code</p>
                <Skeleton className="h-9" />
              </div>
              <div>
                <p>Status</p>
                <Skeleton className="h-9" />
              </div>
              <div>
                <p>Description</p>
                <Skeleton className="h-9" />
              </div>
            </CardContent>
          ) : (
            <CardContent className="space-y-5 max-h-[50vh] px-6 grid grid-cols-2 gap-x-5">
              <FormInput
                form={form}
                name={"name" as Path<T>}
                label="Product"
                placeholder="Insert Product name"
                disabled
              />
              <FormSelectData
                form={form}
                name={"categories_id" as Path<T>}
                label="Category"
                disabled
                data={categoriesResult ?? []}
                valueKey="id"
                labelKey="name"
              />
              <FormInput
                form={form}
                name={"upc" as Path<T>}
                label="Product Code"
                placeholder="Insert Product code"
                type="text"
                disabled
              />
              <FormInput
                form={form}
                name={"status" as Path<T>}
                label="Status"
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
          )}

          <DialogInformation
            open={openDialog}
            onOpenChange={setOpenDialog}
            title="Product"
            data={data}
          />
          <Separator />
          {isLoading ? (
            <CardContent>
              <div className="flex gap-2 mb-2">
                <Skeleton className="h-[40px] w-[150px]" />
                <Skeleton className="h-[40px] w-[150px]" />
                <Skeleton className="h-[40px] w-[150px]" />
              </div>
            </CardContent>
          ) : (
            <>
              <CardHeader className="flex justify-between">
                <CardTitle className="text-lg">Product Units</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 space-x-2 gap-y-1 mb-4">
                  {/* Header */}
                  <Label>Unit</Label>
                  <Label>Conversion Factor</Label>
                  <Label>Base Unit</Label>
                  <div></div>
                  <Label className="flex justify-center">Sales Unit</Label>
                  <div></div>
                  <div></div>

                  {/* Data rows */}
                  {fields.map((field, index) => (
                    <Fragment key={field.id}>
                      <FormInput
                        form={form}
                        name={`units.${index}.units_id` as Path<T>}
                        label=""
                        disabled
                      />
                      <FormInput
                        form={form}
                        name={`units.${index}.conversion_factor` as Path<T>}
                        label=""
                        disabled
                      />
                      <FormInput
                        form={form}
                        name={`units.0.units_id` as Path<T>}
                        label=""
                        disabled
                      />
                      <div></div>
                      <div className="flex justify-center">
                        <Checkbox
                          className="mt-4 size-6 "
                          checked={form.getValues(
                            `units.${index}.is_sales_unit` as Path<T>,
                          )}
                          disabled
                        />
                      </div>
                      <div></div>
                      <div></div>
                    </Fragment>
                  ))}
                </div>
              </CardContent>
            </>
          )}
        </form>
      </Form>
      <CardFooter className="justify-end flex gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </CardFooter>
    </Card>
  );
}
