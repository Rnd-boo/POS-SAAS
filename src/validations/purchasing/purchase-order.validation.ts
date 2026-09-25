import z from "zod";

export const purchaseOrderSchema = z.object({
  purchase_order_date: z.string(),
  required_date: z.string(),
  branch_id: z.number(),
  brand_id: z.number(),
  notes: z.string().optional(),
  status: z.string().optional(),
  supplier_id: z.number(),
});

export const purchaseOrderItemSchema = z.object({
  products_units_id: z.string(),
  price: z.number(),
  discount: z.number(),
  qty: z.number(),
});

export const purchaseOrderFormSchema = z.object({
  purchase_order_date: z.string().min(1, "Purchase order date is required"),
  required_date: z.string().min(1, "Required date is required"),
  branch_id: z.string().min(1, "Branch is required"),
  notes: z.string().optional(),
  status: z.string().optional(),
  supplier_id: z.string().min(1, "Supplier is required"),
  purchase_order_item: z.array(purchaseOrderItemSchema),
});

export type PurchaseOrder = z.infer<typeof purchaseOrderSchema> & {
  id: string;
};
export type PurchaseOrderForm = z.infer<typeof purchaseOrderFormSchema>;
