import z from "zod";

export const openManufacturingSchema = z.object({
  open_manufacturing_date: z.string(),
  branch_id: z.number(),
  brand_id: z.number().optional(),
  notes: z.string(),
  origin_branch_location_id: z.string().optional(),
  destination_branch_location_id: z.string().optional(),
  type: z.string(),
  qty: z.string().optional(),
});

export const productionOrderFormSchema = z.object({
  open_manufacturing_date: z.string(),
  branch_id: z.string().min(1, "Branch is required"),
  notes: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  bill_of_materials_id: z.string().min(1, "Bill Of Material is required"),
  status: z.string().optional(),
  qty: z.string().min(1, "QTY is required"),
});

export type OpenManufacturing = z.infer<typeof openManufacturingSchema> & {
  id: string;
};
export type ProductionOrderForm = z.infer<typeof productionOrderFormSchema>;
