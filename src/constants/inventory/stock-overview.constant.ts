import { parseAsString } from "nuqs/server";
export const STOCK_LIST_FILTER_PARSERS = {
  product_units_id: parseAsString,
  branchId: parseAsString,
  locationId: parseAsString,
  date: parseAsString,
};
