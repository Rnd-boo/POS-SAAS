"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { OpenManufacturingForm } from "@/validations/production/open-manufacturing.validation";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/common/form/form-input";
import FormOpenManufacturingInformation from "./form-open-manufacturing-information";
import FormOpenManufacturinDetail from "./form-open-manufacturing-detail";
import { DisplayName } from "@/constants/products/bill-of-materials.constant";
import CreateButton from "@/components/common/create-button";

export default function CardOpenManufacturing({
  form,
  onSubmit,
  type,
  displayNames,
  isPending,
  isLoadingOpenManufacturing,
  isLoadingOpenManufacturingDetail,
}: {
  form: UseFormReturn<OpenManufacturingForm>;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  type: "Create" | "Update" | "Detail";
  displayNames?: Record<string, DisplayName | DisplayName[]>;
  isPending?: boolean;
  isLoadingOpenManufacturing?: boolean;
  isLoadingOpenManufacturingDetail?: boolean;
}) {
  const router = useRouter();
  const BOMType = form.getValues("type");
  const productName = form.getValues("product_name");
  return (
    <Form {...form}>
      <form className="w-full pb-28" onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{type} Open Manufacturing</CardTitle>
          </CardHeader>
          <CardContent>
            <FormOpenManufacturingInformation
              form={form}
              type={type}
              isLoading={isLoadingOpenManufacturing}
            />
          </CardContent>
        </Card>
        <Card className="my-2">
          <CardHeader>
            <CardTitle className="text-md">Open Manufacturing Detail</CardTitle>
            <CardDescription>
              {type === "Create" ? `New  ` : ""}
              <span className="capitalize">{BOMType} :</span> {productName}
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <FormOpenManufacturinDetail
              form={form}
              type={type}
              displayNames={displayNames}
              isLoading={isLoadingOpenManufacturingDetail}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="w-full">
            <FormInput
              form={form}
              label="Notes"
              name="notes"
              type="textarea"
              disabled={type === "Detail"}
            />
          </CardContent>
        </Card>
        <CreateButton type={type} isPending={isPending} />
      </form>
    </Form>
  );
}
