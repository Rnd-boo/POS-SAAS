import { firstDayofMonth, formatDateLocal } from "@/lib/format-date";
import { parseAsString } from "nuqs/server";

export const stockListFilterParsers = {
  product_units_id: parseAsString,
  branchId: parseAsString,
  locationId: parseAsString,
  date: parseAsString,
};
