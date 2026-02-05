"use client";

import {
  DisplayName,
  INITIAL_BOM,
  INITIAL_STATE_BOM,
} from "@/constants/products/bill-of-materials.constant";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import {
  BillOfMaterialsForm,
  billOfMaterialsFormSchema,
} from "@/validations/products/bill-of-materials-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import CardFormBillOfMaterials from "../../_components/card-form-bill-of-materials";
import { toast } from "sonner";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Unit } from "@/validations/products/unit-validation";
import { updateBillOfMaterials } from "../../action";
import {
  Product,
  ProductUnit,
} from "@/validations/products/product-validation";
import { error } from "console";

export default function EditBillOfMaterials() {
  const params = useParams();
  const billOfMaterialsId = params?.id as string;
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [displayNames, setDisplayNames] = useState<
    Record<string, DisplayName | DisplayName[]>
  >({});

  const form = useForm<BillOfMaterialsForm>({
    resolver: zodResolver(billOfMaterialsFormSchema),
    defaultValues: INITIAL_BOM,
  });
  const { data: billOfMaterials, isLoading: isLoadingBillOfMaterials } =
    useQuery({
      queryKey: ["billOfMaterials", billOfMaterialsId],
      queryFn: async () => {
        const result = await supabase
          .from("bill_of_materials")
          .select(
            `id, name, code, type, product_units_id, status, description,  
            product_units (
              id,products_id,units_id,
              products (id,name),
              units (id,name)
              )`,
          )
          .eq("clients_id", currentId)
          .eq("id", billOfMaterialsId)
          .single();

        if (result.error)
          toast.error("Get billOfMaterials Data Failed", {
            description: result.error.message,
          });

        return result.data;
      },
      enabled: !!currentId && !!billOfMaterialsId,
    });

  const {
    data: productBillOfMaterials,
    isLoading: isLoadingProductBillOfMaterials,
  } = useQuery({
    queryKey: ["productBillOfMaterials", billOfMaterialsId],
    queryFn: async () => {
      const result = await supabase
        .from("product_bill_of_materials")
        .select(
          `id, qty, waste, bill_of_materials(id),  
            product_units (
              id,products_id,units_id,
              products(id,name),
              units (id,name)
              )`,
        )
        .eq("clients_id", currentId)
        .eq("bill_of_materials_id", billOfMaterialsId);

      if (result.error)
        toast.error("Get billOfMaterials Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!billOfMaterialsId,
  });

  useEffect(() => {
    setDisplayNames((prev) => ({
      ...prev,
      bill_of_materials: {
        productName: (billOfMaterials?.product_units as { products?: Product })
          ?.products?.name,
        unitName: (billOfMaterials?.product_units as { units?: Unit })?.units
          ?.name,
      },
    }));
    form.setValue("name", billOfMaterials?.name);
    form.setValue("type", billOfMaterials?.type);
    form.setValue("code", billOfMaterials?.code);
    form.setValue(
      "description",
      billOfMaterials?.description === null ? "" : billOfMaterials?.description,
    );
    form.setValue(
      "product_units_id",
      String((billOfMaterials?.product_units as { id?: string })?.id ?? ""),
    );

    form.setValue("code", billOfMaterials?.code);
    form.setValue("status", billOfMaterials?.status ? "true" : "false");

    if (productBillOfMaterials) {
      const formattedproductBillOfMaterials = productBillOfMaterials.map(
        (item) => ({
          product_units_id: String((item.product_units as { id?: string })?.id),
          qty: String(item.qty),
          waste: item.waste,
          wastePercentage: (item.waste / item.qty) * 100,
        }),
      );
      form.setValue("product_bom", formattedproductBillOfMaterials);

      const displayProductBOMNames = productBillOfMaterials.map((item) => ({
        productName:
          (item.product_units as { products?: Product })?.products?.name ?? "",
        unitName: (item.product_units as { units?: Unit })?.units?.name ?? "",
      }));
      setDisplayNames((prev) => ({
        ...prev,
        product_bom: displayProductBOMNames,
      }));
    }
  }, [billOfMaterials, productBillOfMaterials, form]);

  const [updateBOMState, updateBOMAction, isPendingUpdateBOM] = useActionState(
    updateBillOfMaterials,
    INITIAL_STATE_BOM,
  );
  console.log(form.getValues("product_units_id"));
  const onSubmit = form.handleSubmit(
    async (data) => {
      // Debug: Log the form data
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "product_bom") {
          formData.append("product_bom", JSON.stringify(value));
        } else {
          formData.append(key, String(value ?? ""));
        }
      });
      formData.append("brand_id", String(currentBrandId));
      formData.append("id", String(billOfMaterialsId));
      startTransition(() => {
        updateBOMAction(formData);
      });
    },
    (errors) => {
      console.log(errors);
    },
  );
  useEffect(() => {
    if (updateBOMState?.status === "error") {
      toast.error("Update Bill Of Material Failed", {
        description: updateBOMState.errors?._form?.[0],
      });
    }
    if (updateBOMState?.status === "success") {
      toast.success("Update Bill Of Material Success");
      form.reset();
      queryClient.refetchQueries({ queryKey: ["billOfMaterials"] });
      queryClient.refetchQueries({ queryKey: ["productBillOfMaterials"] });
      router.push("/master-data/bill-of-materials");
    }
  }, [updateBOMState]);

  return (
    <CardFormBillOfMaterials
      form={form}
      type="Update"
      onSubmit={onSubmit}
      isPending={isPendingUpdateBOM}
      displayNames={displayNames}
    />
  );
}
