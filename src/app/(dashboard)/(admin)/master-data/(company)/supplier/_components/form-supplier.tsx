import FormInput from "@/components/common/form/form-input";
import FormCheckbox from "@/components/common/form/form-checkbox";
import FormSelect from "@/components/common/form/form-select";
import { STATUS_LIST } from "@/constants/general.constant";
import { SupplierForm } from "@/validations/supplier-validation";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Fragment, useEffect } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";

export default function FormSupplier({
  form,
  type,
  isLoading,
}: {
  form: UseFormReturn<SupplierForm>;
  type: "Detail" | "Create" | "Update";
  isLoading?: boolean;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "supplier_PIC",
  });
  const paymentMethod = form.watch("payment_method");

  const handleDefaultPICChange = (
    index: number,
    checked: boolean | "indeterminate",
  ) => {
    const isChecked = checked === true;

    form.setValue(
      "supplier_PIC",
      (form.getValues("supplier_PIC") ?? []).map((pic, picIndex) => ({
        ...pic,
        is_default: picIndex === index ? isChecked : false,
      })),
      {
        shouldDirty: true,
        shouldTouch: true,
      },
    );
  };

  useEffect(() => {
    if (paymentMethod === "cash") form.setValue("credit_terms", "0");
  }, [paymentMethod]);
  return (
    <div>
      <div className="grid grid-cols-[1fr_1fr_auto] gap-4 border p-4 rounded-2xl">
        <p className="col-span-3 text-md font-medium text-muted-foreground">
          Supplier Information
        </p>
        <FormInput
          form={form}
          name="name"
          label="Supplier"
          placeholder="Insert supplier name"
          className="col-span-2"
          required
        />
        <FormSelect
          form={form}
          name="status"
          label="Status"
          className="w-40"
          selectItem={STATUS_LIST}
        />
        <FormInput
          form={form}
          name="address"
          label="Address"
          placeholder="Insert address"
          type="textarea"
          className="col-span-2"
          required
        />
        <div />
        <FormInput
          form={form}
          name="city"
          label="City"
          placeholder="Insert city"
        />
        <FormInput
          form={form}
          name="state"
          label="State"
          placeholder="Insert state"
        />
        <div />
        <FormInput
          form={form}
          name="country"
          label="Country"
          placeholder="Insert country"
        />
        <FormInput
          form={form}
          name="phone"
          label="Phone"
          placeholder="e.g. 0812-0000-1234"
        />
      </div>
      <div className="border rounded-2xl p-4 my-4">
        <h3 className="font-medium text-muted-foreground mb-4 ">
          Supplier Person In Charge
        </h3>
        <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-2">
          <Label>
            Person name <span className="text-destructive">*</span>
          </Label>
          <Label>Email</Label>
          <Label>Cell phone</Label>
          <Label>Default</Label>
          <Label></Label>
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <FormInput form={form} name={`supplier_PIC.${index}.name`} />
              <FormInput form={form} name={`supplier_PIC.${index}.email`} />
              <FormInput form={form} name={`supplier_PIC.${index}.phone`} />
              <FormCheckbox
                form={form}
                name={`supplier_PIC.${index}.is_default`}
                className="justify-center"
                onCheckedChange={(checked) =>
                  handleDefaultPICChange(index, checked)
                }
              />
              {fields.length > 1 && type !== "Detail" && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => remove(index)}
                  className="cursor-pointer mt-2"
                >
                  <X />
                </Button>
              )}
            </Fragment>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ name: "", email: "", phone: "", is_default: false })
          }
          className="mt-4"
        >
          <Plus /> Add PIC
        </Button>
      </div>
      <div className="border rounded-2xl p-4 grid grid-cols-3 gap-4">
        <h3 className="font-medium text-muted-foreground col-span-full">
          Payment & Bank Detail
        </h3>
        <FormSelect
          form={form}
          name="payment_method"
          label="Payment Method"
          selectItem={[
            { value: "cash", label: "Cash" },
            { value: "credit", label: "Credit" },
          ]}
          required
        />
        <FormInput
          form={form}
          name="credit_terms"
          label="Credit Terms (days)"
          type="number"
          disabled={paymentMethod === "cash"}
          required
        />
        <div />
        <FormInput form={form} name="bank_name" label="Bank Name" />
        <FormInput
          form={form}
          name="bank_account_number"
          label="Bank Account Number"
        />
        <FormInput
          form={form}
          name="bank_account_name"
          label="Bank Account Name"
        />
      </div>
      <FormInput
        form={form}
        name="notes"
        type="textarea"
        label="Notes"
        className="p-2 mt-2"
      />
    </div>
  );
}
