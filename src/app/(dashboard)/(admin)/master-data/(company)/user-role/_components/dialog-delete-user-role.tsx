import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Roles } from "@/validations/role.validation";
import { INITIAL_STATE_ROLE } from "@/constants/user/user-role.constant";
import { AlertDialogDelete } from "@/components/common/dialog/alert-dialog-delete";
import { deleteUserRole } from "../action";

export default function DialogDeleteUserRole({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Roles;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteUserRoleState, deleteUserRoleAction, isPendingDeleteUserRole] =
    useActionState(deleteUserRole, INITIAL_STATE_ROLE);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteUserRoleAction(formData);
    });
  };

  useEffect(() => {
    if (deleteUserRoleState?.status === "error") {
      toast.error("Delete User Role Failed", {
        description: deleteUserRoleState.errors?._form?.[0],
      });
    }
    if (deleteUserRoleState?.status === "success") {
      toast.success("Delete User Role Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteUserRoleState]);

  return (
    <AlertDialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteUserRole}
      onSubmit={onSubmit}
      title="User Role"
      name={currentData?.name as string}
    />
  );
}
