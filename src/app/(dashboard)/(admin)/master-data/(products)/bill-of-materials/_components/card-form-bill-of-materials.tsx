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
import { UnitProduct } from "@/types/products/product-dialog";
import { DisplayName } from "@/constants/products/bill-of-materials.constant";

export default function CardFormBillOfMaterials({
  form,
  isPending,
  type,
  displayNames,
  onSubmit,
}: {
  form: UseFormReturn<BillOfMaterialsForm>;
  isPending?: boolean;
  type: "Create" | "Detail" | "Update";
  displayNames?: Record<string, DisplayName | DisplayName[]>;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [activeMapping, setActiveMapping] = useState<Record<string, string>>(
    {},
  );
  const [selectedProduct, setSelectedProduct] = useState<
    Record<string, UnitProduct | null>
  >({});
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
              selectedProduct={selectedProduct}
              setActiveMapping={setActiveMapping}
              form={form}
              setOpen={setOpenDialog}
              type={type}
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
              setSelectedProduct={setSelectedProduct}
              selectedProduct={selectedProduct}
              form={form}
              type={type}
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
              {type === "Detail" ? "Back" : "Cancel"}
            </Button>
            {type !== "Detail" && (
              <Button type="submit">
                {isPending ? <Loader2 className="animate-spin" /> : type}
              </Button>
            )}
          </CardFooter>
        </Card>
        <DialogProducts
          setSelectedProduct={setSelectedProduct}
          open={openDialog}
          onOpenChange={setOpenDialog}
          form={form}
          mapping={activeMapping}
        />
      </form>
    </Form>
  );
}
