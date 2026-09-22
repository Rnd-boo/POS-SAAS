import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SupplierForm } from "@/validations/supplier-validation";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import FormSupplier from "./form-supplier";
import CreateButton from "@/components/common/create-button";

export default function CardFormSupplier({
  form,
  type,
  isLoading,
  isPending,
  onSubmit,
}: {
  form: UseFormReturn<SupplierForm>;
  type: "Create" | "Update" | "Detail";
  isLoading?: boolean;
  isPending?: boolean;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full pb-28">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{type} Supplier</CardTitle>
          </CardHeader>
          <CardContent>
            <FormSupplier form={form} type={type} isLoading={isLoading} />
          </CardContent>
          <CreateButton type={type} isPending={isPending} />
        </Card>
      </form>
    </Form>
  );
}
