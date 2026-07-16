"use client";

import { INITIAL_OPEN_MANUFACTURING } from "@/constants/production/open-manufacturing.constant";
import { INITIAL_PRODUCTION_ORDER } from "@/constants/production/production-order.constant";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import {
  OpenManufacturingForm,
  openManufacturingFormSchema,
} from "@/validations/production/open-manufacturing.validation";
import {
  ProductionOrderForm,
  productionOrderFormSchema,
} from "@/validations/production/production-order.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CardOpenManufacturing from "../_components/card-open-manufacturing";

export default function DetailOpenManufacturing() {
  const params = useParams();
  const openManufacturingId = params?.id as string;
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);

  const form = useForm<OpenManufacturingForm>({
    resolver: zodResolver(openManufacturingFormSchema),
    defaultValues: INITIAL_OPEN_MANUFACTURING,
  });

  const { data: openManufacturingData, isLoading: isLoadingopenManufacturing } =
    useQuery({
      queryKey: ["open_manufacturing", openManufacturingId],
      queryFn: async () => {
        const result = await supabase
          .from("open_manufacturing")
          .select(
            `id, open_manufacturing_date, branch_id, type,  notes, qty, origin_branch_location_id, destination_branch_location_id, bill_of_materials_id,
            product_units (
              id,products_id,units_id,
              products(name),
              units (name)
              )`,
          )
          .eq("clients_id", currentId)
          .eq("brand_id", currentBrandId)
          .eq("id", openManufacturingId)
          .single();

        if (result.error)
          toast.error("Get Open Manufacturing Data Failed", {
            description: result.error.message,
          });

        return result.data;
      },
      enabled: !!currentId && !!openManufacturingId && !!currentBrandId,
    });

  //   const {
  //     data: productBillOfMaterials,
  //     isLoading: isLoadingProductBillOfMaterials,
  //   } = useQuery({
  //     queryKey: ["productBillOfMaterials", billOfMaterialsId],
  //     queryFn: async () => {
  //       const result = await supabase
  //         .from("product_bill_of_materials")
  //         .select(
  //           `id, qty, waste, bill_of_materials(id),
  //             product_units (
  //               id,products_id,units_id,
  //               products(name),
  //               units (name)
  //               )`,
  //         )
  //         .eq("clients_id", currentId)
  //         .eq("bill_of_materials_id", billOfMaterialsId);

  //       if (result.error)
  //         toast.error("Get Product Bill Of Materials Data Failed", {
  //           description: result.error.message,
  //         });

  //       return result.data;
  //     },
  //     enabled: !!currentId && !!billOfMaterialsId,
  //   });

  useEffect(() => {
    form.setValue("branch_id", String(openManufacturingData?.branch_id));
    form.setValue(
      "origin_branch_location_id",
      String(openManufacturingData?.origin_branch_location_id),
    );
    form.setValue(
      "destination_branch_location_id",
      String(openManufacturingData?.destination_branch_location_id),
    );
    form.setValue(
      "open_manufacturing_date",
      openManufacturingData?.open_manufacturing_date,
    );
    form.setValue("type", openManufacturingData?.type);
    form.setValue(
      "bill_of_materials_id",
      openManufacturingData?.bill_of_materials_id
        ? String(openManufacturingData.bill_of_materials_id)
        : "",
    );
    form.setValue("qty", String(openManufacturingData?.qty));
    form.setValue("notes", openManufacturingData?.notes);
  }, [openManufacturingData, form]);

  return <CardOpenManufacturing form={form} type="Detail" />;
}
