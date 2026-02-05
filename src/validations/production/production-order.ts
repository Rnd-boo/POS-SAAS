import z from "zod";

export const productionOrderSchema = z.object({
  id: z.string(),
  production_order_date: z.date(),
  branch_id: z.number(),
  notes: z.string().optional(),
  status: z.boolean(),
});

export type ProductionOrder = z.infer<typeof productionOrderSchema>;
