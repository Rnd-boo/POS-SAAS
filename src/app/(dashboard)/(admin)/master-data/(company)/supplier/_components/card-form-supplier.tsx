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

export default function CardFormSupplier({
  form,
  type,
  brands,
  isPending,
  onSubmit,
}: {
  form: UseFormReturn<SupplierForm>;
  type: "Create" | "Update";
  brands: { value: string; label: string }[];
  isPending: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const router = useRouter();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>{type} Supplier</CardTitle>
            <CardDescription>
              Manage supplier information and supplier contacts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormSupplier form={form} brands={brands} />
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button type="submit">
              {isPending ? <Loader2 className="animate-spin" /> : type}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
