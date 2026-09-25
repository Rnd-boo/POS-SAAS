import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PurchaseOrderForm } from "@/validations/purchasing/purchase-order.validation";
import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import CreateButton from "@/components/common/create-button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import FormPurchaseOrder from "./form-purchase-order";

export default function CardFormPurchaseOrder({
  form,
  type,
  isLoading,
  isPending,
  onSubmit,
}: {
  form: UseFormReturn<PurchaseOrderForm>;
  type: "Create" | "Update" | "Detail";
  isLoading?: boolean;
  isPending?: boolean;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const status = form.getValues("status");
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full pb-28">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{type} Purchase Order</CardTitle>
            {type === "Detail" && (
              <CardAction>
                <div className="flex items-center justify-between border rounded-2xl gap-2 pl-4">
                  <Label>Status</Label>
                  {isLoading ? (
                    <Skeleton className="h-7 rounded-full w-[74px]" />
                  ) : (
                    <div
                      className={cn(
                        "px-2 py-1 rounded-full text-white w-fit capitalize text-sm",
                        status === "true" ? "bg-green-600" : "bg-destructive",
                      )}
                    >
                      {status === "true" ? "Active" : "Inactive"}
                    </div>
                  )}
                </div>
              </CardAction>
            )}
          </CardHeader>
          <CardContent>
            <FormPurchaseOrder form={form} isLoading={false} type="Create" />
          </CardContent>
          <CreateButton type={type} isPending={isPending} />
        </Card>
      </form>
    </Form>
  );
}
