"use client";

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
import FormSelect from "@/components/common/form-select";
import FormInput from "@/components/common/form-input";
import { LOCATION_LIST } from "@/constants/general.constant";
import FormPOSInformation from "../_components/form-pos-information";

export default function CreateBranch() {
  const form = useForm<BranchForm>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: INITIAL_BRANCH,
  });

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Branch</CardTitle>
          <CardDescription>
            Fill the form below to create a new branch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormBranch form={form} />
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>POS Information</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <FormPOSInformation form={form} />
        </CardContent>
      </Card>
    </>
  );
}
