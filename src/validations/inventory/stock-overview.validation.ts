import z from "zod";

export const stockOverviewSchema = z.object({
  product_units_id: z.string(),
  date: z.date(),
  branch_location_id: z.string(),
  branch_id: z.number(),
  brand_id: z.number().optional(),
});

export const stockOverviewFormSchema = z.object({
  product_units_id: z.string(),
  date: z.string().min(1, "Date is required"),
  branch_location_id: z.string().min(1, "Location is required"),
  branch_id: z.string(),
  brand_id: z.string().optional(),
});

export type StockOverview = z.infer<typeof stockOverviewSchema>;
export type StockOverviewForm = z.infer<typeof stockOverviewFormSchema>;
