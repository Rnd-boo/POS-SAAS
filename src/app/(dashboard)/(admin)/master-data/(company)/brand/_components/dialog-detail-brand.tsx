import { FieldValues } from "react-hook-form";

import DialogInformation from "@/components/common/dialog-information";

export default function DialogDetailBrand<T extends FieldValues>({
  informationData,
  handleChangeAction,
  open,
}: {
  informationData: { label: string; value: string | number | undefined }[];
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  return (
    <DialogInformation
      open={open ?? false}
      onOpenChange={handleChangeAction ?? (() => {})}
      title="Brand"
      data={informationData}
    />
  );
}
