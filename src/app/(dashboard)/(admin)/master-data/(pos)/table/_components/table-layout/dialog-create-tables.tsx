// import { zodResolver } from "@hookform/resolvers/zod";
// import { startTransition, useActionState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { createTableLayout } from "../../action";
// import {
//   tableLayoutCreateFormSchema,
//   TableLayoutForm,
// } from "@/validations/(pos)/table.validation";
// import {
//   INITIAL_STATE_TABLE_LAYOUT,
//   INITIAL_TABLE_LAYOUT,
// } from "@/constants/(pos)/table.constant";
// import { useQueryClient } from "@tanstack/react-query";

// export default function DialogCreateTables({
//   refetch,
//   tableMapId,
// }: {
//   refetch: () => void;
//   tableMapId: string;
// }) {
//   const form = useForm<TableLayoutForm>({
//     resolver: zodResolver(tableLayoutCreateFormSchema),
//     defaultValues: INITIAL_TABLE_LAYOUT,
//   });

//   const [
//     createTableLayoutState,
//     createTableLayoutAction,
//     isPendingcreateTableLayout,
//   ] = useActionState(createTableLayout, INITIAL_STATE_TABLE_LAYOUT);

//   const onSubmit = form.handleSubmit(async (data) => {
//     const formData = new FormData();
//     Object.entries(data).forEach(([key, value]) => {
//       formData.append(key, String(value));
//     });

//     startTransition(() => {
//       createTableLayoutAction(formData);
//     });
//   });

//   useEffect(() => {
//     if (createTableLayoutState?.status === "error") {
//       toast.error("Create Tables Failed", {
//         description: createTableLayoutState.errors?._form?.[0],
//       });
//     }
//     if (createTableLayoutState?.status === "success") {
//       toast.success("Create Tables Success");
//       form.reset();
//       document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
//       refetch();
//     }
//   }, [createTableLayoutState]);

//   useEffect(() => {
//     form.setValue("table_map_id", String(tableMapId));
//   });

//   return (
//     <FormTableLayout
//       form={form}
//       onSubmit={onSubmit}
//       isLoading={isPendingcreateTableLayout}
//     />
//   );
// }
