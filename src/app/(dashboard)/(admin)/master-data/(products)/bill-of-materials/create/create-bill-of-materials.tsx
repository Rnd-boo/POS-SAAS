"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { INITIAL_BOM } from "@/constants/products/bill-of-materials.constant";
import {
  BillOfMaterialsForm,
  billOfMaterialsFormSchema,
} from "@/validations/products/bill-of-materials-validation";
import CardFormBillOfMaterials from "../_components/card-form-bill-of-materials";

export default function CreateBillOfMaterials() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<BillOfMaterialsForm>({
    resolver: zodResolver(billOfMaterialsFormSchema),
    defaultValues: INITIAL_BOM,
  });

  //   const [createBOMState, createBOMAction, isPendingcreateBOM] = useActionState(
  //     createBillOfMaterials,
  //     INITIAL_STATE_BOM
  //   );

  //   const onSubmit = form.handleSubmit(async (data) => {
  //     // Debug: Log the form data
  //     const formData = new FormData();
  //     Object.entries(data).forEach(([key, value]) => {
  //       formData.append(key, String(value ?? ""));
  //     });

  //     startTransition(() => {
  //       createBOMAction(formData);
  //     });
  //   });

  //   useEffect(() => {
  //     if (createBOMState?.status === "error") {
  //       toast.error("Create BOM Failed", {
  //         description: createBOMState.errors?._form?.[0],
  //       });
  //     }
  //     if (createBOMState?.status === "success") {
  //       toast.success("Create BOM Success");
  //       form.reset();
  //       queryClient.refetchQueries({ queryKey: ["billOfMaterials"] });
  //       router.push("/master-data/bill-of-materials");
  //     }
  //   }, [createBOMState]);

  return <CardFormBillOfMaterials form={form} type="Create" />;
}
