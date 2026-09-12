"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { useBrandStore } from "@/stores/brand-store";
import { RolesForm } from "@/validations/user/role.validation";
import { useQuery } from "@tanstack/react-query";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

const ACTIONS = ["view", "create", "edit", "delete", "approve"] as const;

export default function FormRolePermission({
  form,
  type,
}: {
  form: UseFormReturn<RolesForm>;
  type: "Detail" | "Create" | "Update";
}) {
  const supabase = createClient();
  const currentBrandId = useBrandStore((s) => s.currentBrandId);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "role_permissions",
  });

  const { data: permissions, isLoading } = useQuery({
    queryKey: ["permissions", currentBrandId],
    queryFn: async () => {
      const result = await supabase
        .from("permissions")
        .select("id,resource,action,module");
      if (result.error)
        toast.error("Get Permission Data Failed", {
          description: result.error.message,
        });
      return result.data ?? [];
    },
  });

  //Group permission into module -> resource -> ...permission
  const grouped = (permissions ?? []).reduce<
    Record<
      string,
      Record<string, { id: string; action: string; resource: string }[]>
    >
  >((acc, p) => {
    acc[p.module] ??= {};
    acc[p.module][p.resource] ??= [];
    acc[p.module][p.resource].push(p);
    return acc;
  }, {});

  const isChecked = (permissionId: string) =>
    fields.some((f) => f.permission_id === permissionId);

  const toggle = (permissionId: string, checked: boolean) => {
    if (checked) {
      append({ permission_id: permissionId });
    } else {
      const idx = fields.findIndex((f) => f.permission_id === permissionId);
      if (idx !== -1) remove(idx);
    }
  };

  //Skeleton UI
  if (isLoading)
    return (
      <div>
        <div className="grid grid-cols-3 place-items-center border p-2 bg-primary rounded-t-lg">
          <Label>Resource</Label>
          <Label className="col-span-2">Actions</Label>
        </div>
        <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] gap-2 border p-2">
          <Skeleton className="h-4" />
          {ACTIONS.map((a) => (
            <Label key={a} className="capitalize mx-auto">
              {a}
            </Label>
          ))}
        </div>
        <div>
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] gap-2 items-center border p-2">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                className="flex items-center gap-2 justify-center"
                key={index}
              >
                <Skeleton className="w-4 h-4 rounded-xs" />
              </div>
            ))}
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                className="flex items-center gap-2 justify-center"
                key={index}
              >
                <Skeleton className="w-4 h-4 rounded-xs" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <div className="grid grid-cols-3 place-items-center border p-2 bg-primary rounded-t-lg">
        <Label>Resource</Label>
        <Label className="col-span-2">Actions</Label>
      </div>

      {Object.entries(grouped).map(([module, resources]) => (
        <div key={module} className="mb-3 ">
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] gap-2 border p-2">
            <Label className="capitalize ">{module.replaceAll("_", " ")}</Label>
            {ACTIONS.map((a) => (
              <Label key={a} className="capitalize mx-auto">
                {a}
              </Label>
            ))}
          </div>
          <div>
            {Object.entries(resources).map(
              ([resource, resourcePermissions]) => (
                <div
                  key={resource}
                  className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] gap-2 items-center border "
                >
                  <Input
                    className="capitalize !opacity-100 !rounded-l-none"
                    value={resource.replaceAll("_", " ")}
                    disabled
                  />
                  {resourcePermissions.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 justify-center"
                    >
                      <Checkbox
                        checked={isChecked(p.id)}
                        onCheckedChange={(checked) => toggle(p.id, !!checked)}
                        disabled={type === "Detail"}
                        className="cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
