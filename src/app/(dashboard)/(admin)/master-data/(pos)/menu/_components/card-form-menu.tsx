import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { MenuForm } from "@/validations/pos/menu.validation";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { STATUS_LIST } from "@/constants/general.constant";
import FormSelectData from "@/components/common/form-select-data";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useBrandStore } from "@/stores/brand-store";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

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

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", currentId],
    queryFn: async () => {
      const result = await supabase
        .from("products")
        .select("id,name")
        .eq("status", true)
        .eq("clients_id", currentId);

      if (result.error)
        toast.error("Get Prouduct Data Failed", {
          description: result.error.message,
        });
      return result.data;
    },
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
    }
  );
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>{type} Menu</CardTitle>
            <CardDescription>
              Manage menu - {type} menu information as needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-4">
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
              name={"products_id"}
              label="Product"
              data={products || []}
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
          </CardContent>
          <Separator />
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
