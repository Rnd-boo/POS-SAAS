import z from "zod";

export const stockAdjustmentSchema = z.object({
  stock_adjustment_date: z.string(),
  branch_location_id: z.string(),
  branch_id: z.number(),
  brand_id: z.number().optional(),
  reason: z.string().optional(),
  notes: z.string(),
});

export const stockAdjustmentFormSchema = z.object({
  stock_adjustment_date: z.string().min(1, "Date is required"),
  branch_location_id: z.string().min(1, "Location is required"),
  branch_id: z.string().min(1, "Branch is required"),
  brand_id: z.string(),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
});

export type StockAdjustmentForm = z.infer<typeof stockAdjustmentFormSchema>;
export type StockAdjustment = z.infer<typeof stockAdjustmentSchema> & {
  id: string;
};
