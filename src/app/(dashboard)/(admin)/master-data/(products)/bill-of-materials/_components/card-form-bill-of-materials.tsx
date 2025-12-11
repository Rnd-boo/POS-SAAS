import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FormProductBOM from "./form-product-bom";
import FormBillOfMaterial from "./form-bill-of-materials";
import { FormEvent, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { BillOfMaterialsForm } from "@/validations/products/bill-of-materials-validation";
import DialogProducts from "@/components/common/dialog-products";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CardFormBillOfMaterials({
  form,
  isPending,
  type,
  onSubmit,
}: {
  form: UseFormReturn<BillOfMaterialsForm>;
  isPending?: boolean;
  type: "Create" | "Detail" | "Update";
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [activeMapping, setActiveMapping] = useState<Record<string, string>>(
    {}
  );
  const [displayNames, setDisplayNames] = useState({});
  const router = useRouter();
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {type} - Bill Of Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormBillOfMaterial
              displayNames={displayNames}
              setActiveMapping={setActiveMapping}
              form={form}
              setOpen={setOpenDialog}
              type="Create"
            />
          </CardContent>
        </Card>
        <Card className="my-2">
          <CardHeader>
            <CardTitle>Bill Of Material Details</CardTitle>
          </CardHeader>
          <CardContent>
            <FormProductBOM
              displayNames={displayNames}
              form={form}
              type="Create"
              setOpen={setOpenDialog}
              setActiveMapping={setActiveMapping}
            />
          </CardContent>
          <CardFooter className="justify-end flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            {type !== "Detail" && (
              <Button type="submit">
                {isPending ? <Loader2 className="animate-spin" /> : type}
              </Button>
            )}
          </CardFooter>
        </Card>
        <DialogProducts
          displayNames={displayNames}
          setDisplayNames={setDisplayNames}
          open={openDialog}
          onOpenChange={setOpenDialog}
          form={form}
          mapping={activeMapping}
        />
      </form>
    </Form>
  );
}
