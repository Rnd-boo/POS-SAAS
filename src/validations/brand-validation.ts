import z from "zod";

export const brandSchema = z.object({
  name: z.string(),
  status: z.boolean(),
});

export const brandFormSchema = z.object({
  name: z.string().min(1, "Brand Name is required"),
  status: z.string().min(1, "Status is required"),
});

export type BrandForm = z.infer<typeof brandFormSchema>;
export type Brand = z.infer<typeof brandSchema> & {
  id: string;
  created_at: string;
  updated_at: string;
  client_profiles: { name: string }[];
};
