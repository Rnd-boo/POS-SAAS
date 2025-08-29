"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Product,
  ProductForm,
  productFormSchema,
} from "@/validations/product-validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { INITIAL_PRODUCT } from "@/constants/product.constant";
import { STATUS_LIST } from "@/constants/general.constant";

export default function ViewProduct() {
  const params = useParams();
  const productSlug = params?.slug as string;
  const router = useRouter();
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: INITIAL_PRODUCT,
  });
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productSlug],
    queryFn: async () => {
      const result = await supabase
        .from("products")
        .select(
          `*, categories (
            name
          )`,
          { count: "exact" }
        )
        .eq("clients_id", currentId)
        .eq("slug", productSlug)
        .single();

      if (result.error)
        toast.error("Get Product Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!productSlug,
  });
  useEffect(() => {
    form.setValue("name", product?.name || "");
    form.setValue("description", product?.description || "");
    form.setValue("status", product?.status?.toString() || "");
    form.setValue("upc", product?.upc || "");
    form.setValue("categories_id", product?.categories?.name || "");
  }, [product, form]);

  return (
    <FormProvider {...form}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{product?.name}</CardTitle>
          <CardDescription>View Product</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 max-h-[50vh] px-6 grid grid-cols-2 gap-x-5">
          <FormInput form={form} name={"name"} label="Product" disabled />
          <FormInput
            form={form}
            name={"categories_id"}
            label="Category"
            disabled
          />
          <FormInput
            form={form}
            name={"upc"}
            label="Product Code"
            type="text"
            disabled
          />
          <FormSelect
            form={form}
            name={"status"}
            label="Status"
            disabled
            selectItem={STATUS_LIST}
          />
          <FormInput
            form={form}
            name={"description"}
            label="Description"
            type="textarea"
            disabled
          />
        </CardContent>
        <CardFooter className="justify-end flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </CardFooter>
      </Card>
    </FormProvider>
  );
}
