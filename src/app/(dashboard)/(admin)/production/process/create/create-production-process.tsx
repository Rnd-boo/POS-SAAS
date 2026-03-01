"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useBrandStore } from "@/stores/brand-store";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  ProductionProcessForm,
  productionProcessFormSchema,
} from "@/validations/production/production-process.validation";
import { INITIAL_PRODUCTION_PROCESS } from "@/constants/production/production-process.constant";
import CardFormProductionProcess from "../_components/card-form-production-process";

export default function CreateProductionProcess() {
  const queryClient = useQueryClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<ProductionProcessForm>({
    resolver: zodResolver(productionProcessFormSchema),
    defaultValues: INITIAL_PRODUCTION_PROCESS,
  });

  useEffect(() => {
    form.reset(INITIAL_PRODUCTION_PROCESS);
  }, [currentBrandId]);
  return (
    <div className="w-full">
      <CardFormProductionProcess form={form} type="Create" />
    </div>
  );
}
