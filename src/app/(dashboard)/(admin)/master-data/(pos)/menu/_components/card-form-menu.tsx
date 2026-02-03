import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CircleQuestionMark, Loader2 } from "lucide-react";
import { FormEvent, Fragment, useEffect, useState } from "react";
import { MenuForm } from "@/validations/pos/menu.validation";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { STATUS_LIST } from "@/constants/general.constant";
import FormSelectData from "@/components/common/form-select-data";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { useBranchQuery } from "@/hooks/queries/use-branches";
import MultipleCombobox, {
  comboboxType,
} from "@/components/common/multiple-combobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FormSwitch from "@/components/common/form-switch";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TYPE_STOCK = [
  { value: "product", label: "Product" },
  { value: "bill_of_material", label: "Bill Of Material" },
];

export default function CardFormMenu({
  form,
  type,
  isPending,
  isLoading,
  onSubmit,
}: {
  form: UseFormReturn<MenuForm>;
  type: "Detail" | "Create" | "Update";
  isPending?: boolean;
  isLoading?: boolean;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const router = useRouter();
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const [branchValue, branchSetValue] = useState<comboboxType[]>([]);
  const { data: branches } = useBranchQuery();
  const typeStock = form.watch("type_stock");
  const selectedItem = form.watch("items_id");

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", currentId],
    queryFn: async () => {
      const result = await supabase
        .from("products")
        .select("id,name, categories(name), description, upc")
        .eq("status", true)
        .eq("clients_id", currentId);

      if (result.error)
        toast.error("Get Prouduct Data Failed", {
          description: result.error.message,
        });
      return result.data;
    },
    enabled: typeStock === "product",
  });

  const { data: billOfMaterials, isLoading: isLoadingBillOfMaterials } =
    useQuery({
      queryKey: ["bill_of_materials", currentId],
      queryFn: async () => {
        const result = await supabase
          .from("bill_of_materials")
          .select("id,name")
          .eq("status", true)
          .eq("clients_id", currentId)
          .eq("type", "assembly");

        if (result.error)
          toast.error("Get Bill Of Materials Data Failed", {
            description: result.error.message,
          });
        return result.data;
      },
      enabled: typeStock === "bill_of_material",
    });

  const {
    data: productBillOfMaterials,
    isLoading: isLoadingProductBillOfMaterials,
  } = useQuery({
    queryKey: ["product_bill_of_materials", currentId, selectedItem],
    queryFn: async () => {
      const q = supabase
        .from("product_bill_of_materials")
        .select(
          "id,bill_of_materials_id,bill_of_materials(product_units(products(name),units(name))),qty,waste,product_units(products(name),units(name))",
        )
        .eq("clients_id", currentId);

      if (selectedItem) {
        q.eq("bill_of_materials_id", Number(selectedItem));
      }

      const result = await q;

      if (result.error)
        toast.error("Get Bill Of Materials Data Failed", {
          description: result.error.message,
        });
      return result.data;
    },
    enabled: typeStock === "bill_of_material" && !!selectedItem,
  });

  const { data: MenuCategories, isLoading: isLoadingMenuCategories } = useQuery(
    {
      queryKey: ["menu-category", currentId],
      queryFn: async () => {
        const result = await supabase
          .from("menu_category")
          .select("id,name")
          .eq("status", true)
          .eq("clients_id", currentId);

        if (result.error)
          toast.error("Get Menu category Data Failed", {
            description: result.error.message,
          });
        return result.data;
      },
    },
  );

  const { replace } = useFieldArray({
    control: form.control,
    name: "menu_branches",
  });

  useEffect(() => {
    replace(
      branchValue.map((v) => ({
        branch_id: String(v.id),
      })),
    );
  }, [branchValue, replace]);

  const selectedProduct = products?.find(
    (c) => c.id.toString() === selectedItem,
  );

  const selectedBOM = productBillOfMaterials;
  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn(
          "w-full grid gap-2 pb-28",
          typeStock === "product" ? "grid-cols-[2fr_auto]" : "grid-cols-1",
        )}
      >
        <Card>
          <CardHeader>
            <CardTitle>{type} Menu</CardTitle>
            <CardDescription>
              Manage menu - {type} menu information as needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-[2fr_2fr_1fr] gap-4">
            <FormInput
              form={form}
              name={"name"}
              label="Menu"
              placeholder="Insert Menu name"
              disabled={type === "Detail"}
              isLoading={isLoading}
            />
            <FormSelectData
              form={form}
              name={"menu_category_id"}
              label="Menu Category"
              data={MenuCategories || []}
              disabled={type === "Detail"}
              isLoading={isLoading}
            />
            <FormSelect
              form={form}
              name={"status"}
              label="Status"
              selectItem={STATUS_LIST}
              disabled={type === "Detail"}
              isLoading={isLoading}
            />
            <MultipleCombobox
              form={form}
              name="menu_branches"
              value={branchValue}
              setValue={branchSetValue}
              label="Branch"
              items={branches ?? []}
            />
          </CardContent>
          <Separator />
          <CardContent className="grid grid-cols-[2fr_2fr_1fr] gap-4">
            <FormSelect
              form={form}
              name={"type_stock"}
              label="Type Stock"
              selectItem={TYPE_STOCK}
              disabled={type === "Detail"}
              isLoading={isLoading}
            />
            {typeStock === "product" && (
              <FormSelectData
                form={form}
                name={"items_id"}
                label="Product Name"
                data={products || []}
                disabled={type === "Detail"}
                isLoading={isLoading}
              />
            )}
            {typeStock === "bill_of_material" && (
              <FormSelectData
                form={form}
                name={"items_id"}
                label="Bill of Material Name"
                data={billOfMaterials || []}
                disabled={type === "Detail"}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>
        {typeStock && (
          <Card>
            <CardHeader>
              <CardTitle>
                {typeStock === "product" ? "Product" : "Bill Of Material"}{" "}
                Detail
              </CardTitle>
            </CardHeader>
            <CardContent>
              {typeStock === "product" ? (
                <>
                  <Label>Name</Label>
                  <Input
                    value={selectedProduct?.name ?? "-"}
                    disabled
                    className="mt-2"
                  />
                  <Label className="mt-2">Category</Label>
                  <Input
                    value={
                      (selectedProduct?.categories as { name?: string })
                        ?.name ?? "-"
                    }
                    disabled
                    className="mt-2"
                  />
                  <Label className="mt-2">Product Code</Label>
                  <Input
                    value={selectedProduct?.upc ?? "-"}
                    disabled
                    className="mt-2"
                  />
                  <Label className="mt-2">Description</Label>
                  <Textarea
                    value={selectedProduct?.description ?? "-"}
                    disabled
                    className="mt-2"
                  />
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-2">
                      <Label>Product Name</Label>
                      <Input
                        value={
                          (
                            selectedBOM?.[0]?.bill_of_materials as {
                              product_units?: { products: { name: string } };
                            }
                          )?.product_units?.products?.name ?? "-"
                        }
                        disabled
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Product Unit</Label>
                      <Input
                        value={
                          (
                            selectedBOM?.[0]?.bill_of_materials as {
                              product_units?: { units: { name: string } };
                            }
                          )?.product_units?.units?.name ?? "-"
                        }
                        disabled
                      />
                    </div>
                  </div>
                  <CardTitle className="text-md mb-2">
                    Product Materials
                  </CardTitle>
                  <Card>
                    <CardContent className="grid gap-x-2  grid-cols-[2fr_1fr_1fr_1fr_1fr]">
                      <Label>Product</Label>
                      <Label>Unit</Label>
                      <Label>QTY</Label>
                      <Label>Waste%</Label>
                      <Label>Waste QTY</Label>
                      {selectedBOM?.map((bom, index) => {
                        return (
                          <Fragment key={bom.id}>
                            <Input
                              value={
                                (
                                  bom.product_units as {
                                    products?: { name: string };
                                  }
                                )?.products?.name ?? "-"
                              }
                              disabled
                              className="mt-2"
                            />

                            <Input
                              value={
                                (
                                  bom.product_units as {
                                    units?: { name: string };
                                  }
                                )?.units?.name ?? "-"
                              }
                              disabled
                              className="mt-2"
                            />

                            <Input
                              value={bom.qty ?? "-"}
                              disabled
                              className="mt-2"
                            />
                            <Input
                              value={(bom.waste / bom.qty) * 100 || "-"}
                              disabled
                              className="mt-2"
                            />
                            <Input
                              value={bom.waste ?? "-"}
                              disabled
                              className="mt-2"
                            />
                          </Fragment>
                        );
                      })}
                    </CardContent>
                  </Card>
                </>
              )}
            </CardContent>
            <Separator />
            <CardContent className="flex gap-x-2  items-center">
              <FormSwitch
                defaultChecked
                form={form}
                label="Auto Decrement"
                name="auto_decrement"
                className="flex"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleQuestionMark className="size-3" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Automatically reduces stock from POS transactions.</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>
        )}
        <div className="fixed bottom-0 right-0 w-full flex justify-end gap-x-2 p-4 bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.6)]">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          {type !== "Detail" && (
            <Button type="submit">
              {isPending ? <Loader2 className="animate-spin" /> : type}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
