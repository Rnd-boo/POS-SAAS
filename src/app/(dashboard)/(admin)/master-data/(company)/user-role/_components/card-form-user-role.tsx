import FormInput from "@/components/common/form/form-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { RolesForm } from "@/validations/role.validation";
import { FormEvent, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import FormRolePermission from "./form-role-permission";
import CreateButton from "@/components/common/create-button";
import { Button } from "@/components/ui/button";
import { ClipboardPaste } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DialogImportRole from "./dialog-import-role";

export default function CardFormUserRole({
  form,
  type,
  isPending,
  isLoading,
  onSubmit,
}: {
  form: UseFormReturn<RolesForm>;
  type: "Detail" | "Create" | "Update";
  isPending?: boolean;
  isLoading?: boolean;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  console.log(open);
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full pb-28">
        <Card>
          <CardHeader>
            <CardTitle>{type} Role</CardTitle>
            <CardDescription>
              Manage role - {type} information as needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <FormInput
              form={form}
              label="Role Name"
              name="name"
              className="w-full mr-2"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => setOpen(true)} type="button">
                  <ClipboardPaste />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import from existing Role</p>
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <FormRolePermission form={form} type={type} />
          </CardContent>
        </Card>
        <CreateButton type="Create" isPending={isPending} />
      </form>
      <DialogImportRole open={open} setOpen={setOpen} />
    </Form>
  );
}
