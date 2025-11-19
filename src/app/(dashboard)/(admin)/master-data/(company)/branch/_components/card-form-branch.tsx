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

export default function CardFormBranch({
  form,
  type,
}: {
  form: UseFormReturn<BranchForm>;
  type: "Detail" | "Create" | "Update";
}) {
  const router = useRouter();

  return (
    <Card className="w-full">
      <Form {...form}>
        <CardHeader>
          <CardTitle>{type} Branch</CardTitle>
          <CardDescription>
            Manage branch - {type} branch information as needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormBranch form={form} type={type} />
        </CardContent>
        <Separator />
        <CardHeader>
          <CardTitle>POS Information</CardTitle>
        </CardHeader>
        <CardContent>
          <FormPOSInformation form={form} type={type} />
        </CardContent>
        <CardFooter className="justify-end flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
}
