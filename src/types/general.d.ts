export type formState = {
  errors?: {
    _form?: string[];
  };
  status?: string;
};

export interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "combobox" | "text" | "date";
  operator?: "eq" | "ilike";
  options?: { value: string; label: string }[];
}
