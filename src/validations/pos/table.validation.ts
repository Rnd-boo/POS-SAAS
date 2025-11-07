import z from "zod";

export const tableMapSchema = z.object({
  name: z.string(),
  branch_id: z.string(),
  brand_id: z.string(),
  status: z.boolean(),
});

export const tableMapFormSchema = z.object({
  name: z.string().min(1, "Table Map Name is required"),
  branch_id: z.string().min(1, "Branch is required"),
  brand_id: z.string(),
  status: z.string().min(1, "Status is required"),
});

export type TableMapForm = z.infer<typeof tableMapFormSchema>;
export type TableMap = z.infer<typeof tableMapSchema> & {
  id: string;
  created_at: string;
  updated_at: string;
  client_profiles: { name: string }[];
};

// TABLE LAYOUT
export const tableLayoutSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Table Name is required"),
  position_x: z.coerce.number().max(1232, "Position X is maximum 1232"),
  position_y: z.coerce.number().max(552, "Position Y is maximum 552"),
  capacity: z.coerce.number().min(1, "Capacity minimum 1"),
  shape: z.string(),
  width: z.coerce
    .number()
    .min(24, "Width minimum 24")
    .max(1280, "Width maximum 600"),
  height: z.coerce
    .number()
    .min(24, "height minimum 24")
    .max(600, "height maximum 600"),
  status: z.boolean(),
});

export const tableLayoutFormSchema = z.object({
  tables: z.array(tableLayoutSchema),
});

export type TableLayoutForm = z.infer<typeof tableLayoutFormSchema>;
