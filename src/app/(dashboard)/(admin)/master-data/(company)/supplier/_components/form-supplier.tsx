import FormInput from "@/components/common/form/form-input";
import FormCheckbox from "@/components/common/form/form-checkbox";
import FormSelect from "@/components/common/form/form-select";
import { STATUS_LIST } from "@/constants/general.constant";
import { SupplierForm } from "@/validations/supplier-validation";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

export default function FormSupplier({
  form,
  brands,
}: {
  form: UseFormReturn<SupplierForm>;
  brands: { value: string; label: string }[];
}) {
  const pics = useFieldArray({ control: form.control, name: "supplier_PIC" });
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormInput form={form} name="name" label="Supplier" placeholder="Insert supplier name" />
      <FormSelect form={form} name="brand_id" label="Brand" selectItem={brands} />
      <FormInput form={form} name="address" label="Address" placeholder="Insert address" />
      <FormInput form={form} name="city" label="City" placeholder="Insert city" />
      <FormInput form={form} name="state" label="State" placeholder="Insert state" />
      <FormInput form={form} name="country" label="Country" placeholder="Insert country" />
      <FormInput form={form} name="phone" label="Phone" placeholder="Insert phone" />
      <FormSelect form={form} name="status" label="Status" selectItem={STATUS_LIST} />
      <FormSelect
        form={form}
        name="payment_method"
        label="Payment Method"
        selectItem={[
          { value: "cash", label: "Cash" },
          { value: "credit", label: "Credit" },
        ]}
      />
      <FormInput form={form} name="credit_terms" label="Credit Terms (days)" type="number" />
      <FormInput form={form} name="bank_name" label="Bank Name" />
      <FormInput form={form} name="bank_account_number" label="Bank Account Number" />
      <FormInput form={form} name="bank_account_name" label="Bank Account Name" />
      <div className="space-y-3 md:col-span-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Supplier PIC</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => pics.append({ name: "", email: "", phone: "", is_default: false })}>
            <Plus className="mr-1 size-4" /> Add PIC
          </Button>
        </div>
        {pics.fields.map((field, index) => (
          <div className="grid grid-cols-1 gap-3 rounded-md border p-3 md:grid-cols-4" key={field.id}>
            <FormInput form={form} name={`supplier_PIC.${index}.name`} label="Name" />
            <FormInput form={form} name={`supplier_PIC.${index}.email`} label="Email" type="email" />
            <FormInput form={form} name={`supplier_PIC.${index}.phone`} label="Phone" />
            <div className="flex items-end">
              <FormCheckbox form={form} name={`supplier_PIC.${index}.is_default`} label="Default" />
              <Button type="button" variant="ghost" size="icon" disabled={pics.fields.length === 1} onClick={() => pics.remove(index)}>
                <Trash2 className="size-4 text-red-400" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
