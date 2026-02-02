import z from "zod";

export const POSUsersSchema = z.object({
  name: z.string(),
  username: z.string(),
  status: z.boolean(),
});

export const POSUsersBranchesSchema = z.object({
  pos_users_id: z.number(), 
  pos_users: z.array(POSUsersSchema),
  branch: z.object({  
    name: z.string(),
  }),
});


export const POSUsersFormSchema = z.object({
  name: z.string().min(1, "Order Context Name is required"),
  status: z.string().min(1, "Status is required"),
  brand_id: z.string(),
});

export type POSUsersForm = z.infer<typeof POSUsersFormSchema>;
export type POSUsers = z.infer<typeof POSUsersSchema> & {
  id: string;
};

export type POSUserBranches = z.infer<typeof POSUsersBranchesSchema> & {
  id: string;
};