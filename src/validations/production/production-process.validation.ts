import z from "zod";

export const productionProcessSchema = z.object({
  production_process_date: z.string(),
  production_orders_id: z.string(),
  branch_id: z.number(),
  branch_location_id: z.number(),
  brand_id: z.number(),
  notes: z.string().optional(),
  qty: z.number(),
  status: z.string().optional(),
});

export const productionProcessFormSchema = z.object({
  production_process_date: z.string(),
  production_orders_id: z.string(),
  branch_id: z.string(),
  branch_location_id: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
  qty: z.string(),
  status: z.string().optional(),
});

export type ProductionProcess = Omit<
  z.infer<typeof productionProcessSchema>,
  "qty" | "brand_id" | "branch_location_id"
> & {
  id: string;
};
export type ProductionProcessForm = z.infer<typeof productionProcessFormSchema>;
