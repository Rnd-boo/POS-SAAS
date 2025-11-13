import z from "zod";

export const orderContextSchema = z.object({
  name: z.string(),
  brand_id: z.string(),
  status: z.boolean(),
});

export const orderContextFormSchema = z.object({
  name: z.string().min(1, "Order Context Name is required"),
  status: z.string().min(1, "Status is required"),
});

export type OrderContextForm = z.infer<typeof orderContextFormSchema>;
export type OrderContext = z.infer<typeof orderContextSchema> & {
  id: string;
};
