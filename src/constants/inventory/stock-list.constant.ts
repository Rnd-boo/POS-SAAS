export type STOCK_LIST_FILTERS = {
  locationId: string;
  categoryId: string;
  upc: string;
  productName: string;
};

export const INITIAL_STOCK_LIST_FILTER: STOCK_LIST_FILTERS = {
  locationId: "",
  categoryId: "",
  upc: "",
  productName: "",
};
