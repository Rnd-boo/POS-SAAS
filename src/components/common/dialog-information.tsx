import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { format } from "date-fns";

export default function DialogInformation({
  open,
  onOpenChange,
  title,
  isLoading,
  fields,
}: {
  open: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: { label: string; value: string | number | undefined }[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Information {title}</DialogTitle>
          </DialogHeader>
          {fields.map((field, i) => {
            let displayValue = field.value ?? "";

            if (
              typeof field.value === "string" &&
              !isNaN(Date.parse(field.value))
            ) {
              displayValue = format(new Date(field.value), "dd-MM-yyyy HH:mm");
            }

            return (
              <div key={i} className="grid gap-1">
                <label className="text-sm font-medium">{field.label}</label>
                <Input value={displayValue} disabled className="capitalize" />
              </div>
            );
          })}
        </form>
      </DialogContent>
    </Dialog>
  );
}
