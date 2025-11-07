export const HEADER_TABLE_TABLE_MAP = [
  "NO",
  "Table Map",
  "Branch",
  "Status",
  "Action",
];

export const INITIAL_TABLE_MAP = {
  name: "",
  branch_id: "",
  brand_id: "",
  status: "",
};

export const INITIAL_STATE_TABLE_MAP = {
  status: "idle",
  errors: {
    name: [],
    branch_id: [],
    brand_id: [],
    status: [],
    _form: [],
  },
};

export const INITIAL_TABLE_LAYOUT = {
  id: "",
  name: "",
  position_x: 0,
  position_y: 0,
  capacity: 0,
  shape: "",
  width: 48,
  height: 48,
  status: true,
};

export const INITIAL_STATE_TABLE_LAYOUT = {
  status: "idle",
  errors: {
    name: [],
    position_x: [],
    position_y: [],
    shape: [],
    width: [],
    height: [],
    capacity: [],
    status: [],
    table_map_id: [],
    _form: [],
  },
};

export const SHAPE_LIST = [
  { label: "Circle", value: "circle" },
  { label: "Rectangle", value: "rectangle" },
];
