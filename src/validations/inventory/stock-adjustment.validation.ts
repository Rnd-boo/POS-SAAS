import z from "zod";

export const stockAdjustmentSchema = z.object({
  stock_adjustment_date: z.string(),
  branch_location_id: z.string(),
  branch_id: z.number(),
  brand_id: z.number().optional(),
  reason: z.string().optional(),
  notes: z.string(),
});

export const stockAdjustmentItemsSchema = z.object({
  products_id: z.string(),
  product_units_id: z.string(),
  current_qty: z.number(),
  conversion_factor: z.number().optional(),
  on_hand: z.number().optional(),
  product_name: z.string().optional(),
  product_upc: z.string().optional(),
  unit_name: z.string().optional(),
});

export const stockAdjustmentFormSchema = z.object({
  stock_adjustment_date: z.string().min(1, "Date is required"),
  branch_location_id: z.string().min(1, "Location is required"),
  branch_id: z.string().min(1, "Branch is required"),
  brand_id: z.string().optional(),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
  status: z.enum(["new", "approved", "rejected"]).optional(),
  stock_adjustment_items: z.array(stockAdjustmentItemsSchema),
});

export type StockAdjustmentForm = z.infer<typeof stockAdjustmentFormSchema>;
export type StockAdjustment = z.infer<typeof stockAdjustmentSchema> & {
  id: string;
};
