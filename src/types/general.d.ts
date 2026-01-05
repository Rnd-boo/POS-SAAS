export type formState = {
  errors?: {
    _form?: string[];
  };
  status?: string;
};

export interface FilterConfig {
  key: string; // ⬅️ column supabase
  label: string;
  type: "select" | "combobox" | "text";
  operator?: "eq" | "ilike";
  options?: { value: string; label: string }[];
}