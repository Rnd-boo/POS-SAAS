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
import FormInput from "@/components/common/form-input";
import FormOpenManufacturingInformation from "./form-open-manufacturing-information";
import FormOpenManufacturinDetail from "./form-open-manufacturing-detail";

export default function CardOpenManufacturing({
  form,
  onSubmit,
  type,
  isPending,
}: {
  form: UseFormReturn<OpenManufacturingForm>;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  type: "Create" | "Update" | "Detail";
  isPending?: boolean;
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
            <FormOpenManufacturingInformation form={form} type={type} />
          </CardContent>
        </Card>
        <Card className="my-2">
          <CardHeader>
            <CardTitle className="text-md">Open Manufacturing Detail</CardTitle>
            <CardDescription>
              New {BOMType} : {productName}
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <FormOpenManufacturinDetail form={form} type={type} />
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
        <div className="fixed bottom-0 right-0 w-full flex justify-end gap-x-2 p-4 bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.6)]">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {type === "Detail" ? "Back" : "Cancel"}
          </Button>
          {type !== "Detail" && (
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : type}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
