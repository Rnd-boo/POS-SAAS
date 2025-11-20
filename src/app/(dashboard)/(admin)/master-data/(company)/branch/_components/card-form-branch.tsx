import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { BranchForm } from "@/validations/branch.validation";
import { UseFormReturn } from "react-hook-form";
import FormBranch from "./form-branch";
import { Separator } from "@/components/ui/separator";
import FormPOSInformation from "./form-pos-information";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";

export default function CardFormBranch({
  form,
  type,
  isPending,
  isLoading,
  onSubmit,
}: {
  form: UseFormReturn<BranchForm>;
  type: "Detail" | "Create" | "Update";
  isPending?: boolean;
  isLoading?: boolean;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const router = useRouter();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{type} Branch</CardTitle>
            <CardDescription>
              Manage branch - {type} branch information as needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormBranch form={form} type={type} isLoading={isLoading} />
          </CardContent>
          <Separator />
          <CardHeader>
            <CardTitle>POS Information</CardTitle>
          </CardHeader>
          <CardContent>
            <FormPOSInformation form={form} type={type} />
          </CardContent>
          <CardFooter className="justify-end flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Back
            </Button>
            {type !== "Detail" && (
              <Button type="submit">
                {isPending ? <Loader2 className="animate-spin" /> : type}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
