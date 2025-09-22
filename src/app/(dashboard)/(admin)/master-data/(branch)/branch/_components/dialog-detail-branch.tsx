import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FieldValues, Form, FormProvider, useForm } from "react-hook-form";
import { Dialog } from "@/components/ui/dialog";
import {
  Branch,
  BranchForm,
  branchFormSchema,
} from "@/validations/branch.validation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FormInput from "@/components/common/form-input";
import DialogInformation from "@/components/common/dialog-information";
import { useRouter } from "next/navigation";
import { INITIAL_BRANCH } from "@/constants/branch.constant";

export default function DialogDetailBranch<T extends FieldValues>({
  informationData,
  handleChangeAction,
  open,
}: {
  informationData: { label: string; value: string | number | undefined }[];
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  return (
    <DialogInformation
      open={open ?? false}
      onOpenChange={handleChangeAction ?? (() => {})}
      title="Branch"
      data={informationData}
    />
  );
}
