"use client";

import { INITIAL_OPEN_MANUFACTURING } from "@/constants/production/open-manufacturing.constant";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useBrandStore } from "@/stores/brand-store";
import {
  OpenManufacturingForm,
  openManufacturingFormSchema,
} from "@/validations/production/open-manufacturing.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CardOpenManufacturing from "../_components/card-open-manufacturing";
import { DisplayName } from "@/constants/products/bill-of-materials.constant";
import { Product } from "@/validations/products/product-validation";
import { Unit } from "@/validations/products/unit-validation";

export default function DetailOpenManufacturing() {
  const params = useParams();
  const openManufacturingId = params?.id as string;
  const supabase = createClient();
  const currentId = useAuthStore((state) => state.profile?.clients);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const [displayNames, setDisplayNames] = useState<
    Record<string, DisplayName | DisplayName[]>
  >({});

  const form = useForm<OpenManufacturingForm>({
    resolver: zodResolver(openManufacturingFormSchema),
    defaultValues: INITIAL_OPEN_MANUFACTURING,
  });

  const { data: openManufacturingData, isLoading: isLoadingOpenManufacturing } =
    useQuery({
      queryKey: ["open_manufacturing", openManufacturingId, currentBrandId],
      queryFn: async () => {
        const result = await supabase
          .from("open_manufacturing")
          .select(
            `id, open_manufacturing_date, branch_id, type,  notes, qty, origin_branch_location_id, destination_branch_location_id, bill_of_materials_id, product_name,
            product_units (
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

  const {
    data: openManufacturingDetailData,
    isLoading: isLoadingOpenManufacturingDetail,
  } = useQuery({
    queryKey: ["open_manufacturing_detail", openManufacturingId],
    queryFn: async () => {
      const result = await supabase
        .from("open_manufacturing_detail")
        .select(
          `qty,  product_name,
            product_units (
              products(id,name,upc),
              units (name)
              )`,
        )
        .eq("clients_id", currentId)
        .eq("open_manufacturing_id", openManufacturingId);

      if (result.error)
        toast.error("Get Open Manufacturing Data Failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!currentId && !!openManufacturingId,
  });

  useEffect(() => {
    if (!openManufacturingData) return;
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
    form.setValue("product_name", openManufacturingData?.product_name);

    setDisplayNames((prev) => ({
      ...prev,
      products_units_id: {
        productName: (
          openManufacturingData?.product_units as { products?: Product }
        )?.products?.name,
        unitName: (openManufacturingData?.product_units as { units?: Unit })
          ?.units?.name,
      },
    }));
  }, [openManufacturingData, form]);

  useEffect(() => {
    if (!openManufacturingDetailData) return;
    const productsDetail = openManufacturingDetailData.map((item) => ({
      product_name: item.product_name,
      product_upc: (item.product_units as { products?: Product })?.products
        ?.upc,
      qty: item.qty,
      products_id: (item.product_units as unknown as { products: Product })
        ?.products?.id,
      product_units_id: (item.product_units as unknown as { id: string }).id,
      unit_name: (item.product_units as { units?: Unit })?.units?.name,
    }));
    form.setValue("products_detail", productsDetail);
  }, [openManufacturingDetailData, form]);

  return (
    <CardOpenManufacturing
      form={form}
      type="Detail"
      displayNames={displayNames}
      isLoadingOpenManufacturing={isLoadingOpenManufacturing}
      isLoadingOpenManufacturingDetail={isLoadingOpenManufacturingDetail}
    />
  );
}
