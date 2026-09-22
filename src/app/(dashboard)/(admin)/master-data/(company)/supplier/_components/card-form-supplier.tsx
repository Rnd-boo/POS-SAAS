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
import { SupplierForm } from "@/validations/supplier-validation";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import FormSupplier from "./form-supplier";
import CreateButton from "@/components/common/create-button";

export default function CardFormSupplier({
  form,
  type,
  isPending,
  onSubmit,
}: {
  form: UseFormReturn<SupplierForm>;
  type: "Create" | "Update";
  isPending: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const router = useRouter();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full pb-28">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{type} Supplier</CardTitle>
          </CardHeader>
          <CardContent>
            <FormSupplier form={form} />
          </CardContent>
          <CreateButton type={type} isPending={isPending} />
        </Card>
      </form>
    </Form>
  );
}
