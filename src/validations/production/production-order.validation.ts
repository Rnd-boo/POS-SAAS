import z from "zod";

export const productionOrderSchema = z.object({
  production_order_date: z.string(),
  branch_id: z.number(),
  brand_id: z.number(),
  notes: z.string().optional(),
  status: z.string(),
  type: z.string(),
  bill_of_materials_id: z.string(),
  qty: z.string(),
});

export const productionOrderFormSchema = z.object({
  production_order_date: z.string(),
  branch_id: z.string().min(1, "Branch is required"),
  notes: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  bill_of_materials_id: z.string().min(1, "Bill Of Material is required"),
  qty: z.string().min(1, "QTY is required"),
});

export type ProductionOrder = z.infer<typeof productionOrderSchema> & {
  id: string;
};
export type ProductionOrderForm = z.infer<typeof productionOrderFormSchema>;
