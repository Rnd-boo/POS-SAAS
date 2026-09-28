import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { AlertDialogDelete } from "@/components/common/dialog/dialog-delete";
import { INITIAL_STATE_USER } from "@/constants/user/user.constant";
import { User } from "@/validations/user/user.validation";
import { deleteUser } from "../../action";

export default function DialogDeleteUser({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: User;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteUserState, deleteUserAction, isPendingDeleteUser] =
    useActionState(deleteUser, INITIAL_STATE_USER);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteUserAction(formData);
    });
  };

  useEffect(() => {
    if (deleteUserState?.status === "error") {
      toast.error("Delete User Failed", {
        description: deleteUserState.errors?._form?.[0],
      });
    }
    if (deleteUserState?.status === "success") {
      toast.success("Delete User Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteUserState]);

  return (
    <AlertDialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteUser}
      onSubmit={onSubmit}
      title="User"
      name={currentData?.name as string}
    />
  );
}
