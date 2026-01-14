"use client";

import { useForm } from "react-hook-form";
import CardFormBillOfMaterials from "../../_components/card-form-bill-of-materials";
import {
  BillOfMaterialsForm,
  billOfMaterialsFormSchema,
} from "@/validations/products/bill-of-materials-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { INITIAL_BOM } from "@/constants/products/bill-of-materials.constant";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import { Unit } from "@/validations/unit-validation";

export default function DetailBillOfMaterials() {
  const params = useParams();
  const billOfMaterialsId = params?.id as string;
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  //   const currentBrandId = useBrandStore((s) => s.currentBrandId); harus tambahs sesuai brand next update

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
            `id, name, code, type, products_id, product_units_id, status, description, products(name), 
            product_units (
              id,products_id,units_id,
              units (name)
              )`
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
          `id, qty, waste, bill_of_materials(id), products(name), 
            product_units (
              id,products_id,units_id,
              units (name)
              )`
        )
        .eq("clients_id", currentId)
        .eq("bill_of_materials.id", billOfMaterialsId);

      if (result.error)
        toast.error("Get billOfMaterials Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!billOfMaterialsId,
  });

  useEffect(() => {
    form.setValue("name", billOfMaterials?.name);
    form.setValue("type", billOfMaterials?.type);
    form.setValue("code", billOfMaterials?.code);
    form.setValue("description", billOfMaterials?.description);
    form.setValue(
      "products_id",
      (billOfMaterials?.products as { name?: string })?.name ?? ""
    );
    form.setValue(
      "product_units_id",
      (billOfMaterials?.product_units as unknown as { units: Unit })?.units
        ?.name ?? ""
    );

    form.setValue("code", billOfMaterials?.code);
    form.setValue("status", billOfMaterials?.status ? "true" : "false");

    if (productBillOfMaterials) {
      const formattedproductBillOfMaterials = productBillOfMaterials.map(
        (item) => ({
          products_id: String(
            (item.products as unknown as { name: string }).name
          ),
          product_units_id: String(
            (item.product_units as unknown as { units: Unit }).units.name
          ),
          qty: item.qty,
          waste: item.waste,
          wastePercentage: (item.waste / item.qty) * 100,
        })
      );
      form.setValue("product_bom", formattedproductBillOfMaterials);
    }
  }, [billOfMaterials, form]);
  return <CardFormBillOfMaterials type="Detail" form={form} />;
}
