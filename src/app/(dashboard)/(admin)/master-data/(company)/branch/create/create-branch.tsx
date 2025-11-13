import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormBranch from "../_components/form-branch";
import { BranchForm, branchFormSchema } from "@/validations/branch.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { INITIAL_BRANCH } from "@/constants/branch.constant";
import { useForm } from "react-hook-form";

export default function CreateBranch() {
  const form = useForm<BranchForm>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: INITIAL_BRANCH,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Branch</CardTitle>
        <CardDescription>
          Fill the form below to create a new branch.
        </CardDescription>
        <CardContent>
          <FormBranch form={form} type="Create" />
        </CardContent>
      </CardHeader>
    </Card>
  );
}
