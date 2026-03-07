import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ProductionProcessForm } from "@/validations/production/production-process.validation";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import FormProductionOrderBOM from "./form-production-process";
import FormProductionMaterial from "./form-production-material";

export default function CardFormProductionProcess({
  form,
  type,
  onSubmit,
  isPending,
  isLoading,
  handleReject,
}: {
  form: UseFormReturn<ProductionProcessForm>;
  type: "Create" | "Update" | "Detail" | "Authorize";
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
  isLoading?: boolean;
  handleReject?: () => void;
}) {
  const router = useRouter();

  const status = form.watch("status");
  return (
    <Form {...form}>
      <form className="w-full pb-28" onSubmit={onSubmit}>
        <div className={cn(type === "Detail" ? "flex gap-2" : "")}>
          <Card className={cn(type === "Detail" ? "w-3/4" : "w-full")}>
            <CardHeader>
              <CardTitle>
                {type === "Authorize" ? "Create" : type} Production Process
              </CardTitle>
              <CardDescription>
                {type === "Authorize" ? "Confirm" : type} Production Process
                information as needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormProductionOrderBOM form={form} type={type} />
            </CardContent>
          </Card>
          {type === "Detail" && (
            <Card className="w-1/4 h-fit">
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label>Status</Label>
                  {isLoading ? (
                    <Skeleton className="h-9 rounded-full w-[144px]" />
                  ) : (
                    <div
                      className={cn(
                        "px-2 py-1 rounded-full text-white w-fit capitalize text-sm",
                        status === "new"
                          ? "bg-green-600"
                          : status === "rejected"
                            ? "bg-destructive"
                            : "bg-blue-600",
                      )}
                    >
                      {status}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <Card className="my-2">
          <CardHeader>
            <CardTitle>Production Result Materials</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <FormProductionMaterial form={form} type={type} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="w-full">
            <FormInput
              isLoading={isLoading}
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
          {type === "Authorize" && (
            <Button type="button" variant="destructive" onClick={handleReject}>
              {isPending ? <Loader2 className="animate-spin" /> : "Reject"}
            </Button>
          )}
          {type !== "Detail" && (
            <Button type="submit">
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : type === "Authorize" ? (
                "Approve"
              ) : (
                type
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
