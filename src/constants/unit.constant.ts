export const HEADER_TABLE_UNIT = ["NO", "Unit", "Notes", "Action"];

export const INITIAL_UNIT = {
  name: "",
  notes: "",
};

export const INITIAL_STATE_UNIT = {
  status: "idle",
  errors: {
    name: [],
    notes: [],
    _form: [],
  },
};
