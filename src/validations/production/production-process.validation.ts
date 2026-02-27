import z from "zod";

export const productionProcessSchema = z.object({
  production_process_date: z.string(),
  production_orders_id: z.string(),
  branch_id: z.number(),
  branch_location_id: z.number(),
  brand_id: z.number(),
  notes: z.string().optional(),
  status: z.string().optional(),
});

export const productionProcessFormSchema = z.object({
  production_process_date: z.string(),
  production_orders_id: z.string(),
  branch_id: z.string(),
  branch_location_id: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
  status: z.string().optional(),
});

export type ProductionProcess = z.infer<typeof productionProcessSchema> & {
  id: string;
};
export type ProductionProcessForm = z.infer<typeof productionProcessFormSchema>;
