export type TableMapFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    branch_id?: string[];
    brand_id?: string[];
    status?: string[];
    _form?: string[];
  };
};

export type TableLayoutFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    position_x?: string[];
    position_y?: string[];
    capacity?: string[];
    shape?: string[];
    width?: string[];
    height?: string[];
    status?: string[];
    table_map_id?: string[];
    _form?: string[];
  };
};
