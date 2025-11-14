import z from "zod";

export const orderContextSchema = z.object({
  name: z.string(),
  tax_value: z.number(),
  tax_name: z.string(),
  other_tax_value: z.number(),
  other_tax_name: z.string(),
  brand_id: z.string(),
  status: z.boolean(),
});

export const orderContextFormSchema = z.object({
  name: z.string().min(1, "Order Context Name is required"),
  tax_value: z.string().min(0).max(100, "Must be between 0 and 100"),
  tax_name: z.string().min(0).max(10, "Maximum 10 characters"),
  other_tax_value: z.string().optional(),
  other_tax_name: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

export type OrderContextForm = z.infer<typeof orderContextFormSchema>;
export type OrderContext = z.infer<typeof orderContextSchema> & {
  id: string;
};
