// hooks/use-stock-card-query.ts
"use client";

import { getStockCard } from "@/actions/stock-card-action";
import { useQuery } from "@tanstack/react-query";

export function useStockCardQuery(
  productUnitId: string | undefined,
  branchLocationId: string | undefined,
  startDate: string,
  endDate: string,
  page: number,
) {
  const query = useQuery({
    queryKey: [
      "stock-card",
      productUnitId,
      branchLocationId,
      startDate,
      endDate,
      page,
    ],
    queryFn: async () => {
      const result = await getStockCard(
        productUnitId!,
        branchLocationId!,
        startDate,
        endDate,
        page,
      );

      return result;
    },
    enabled: !!productUnitId && !!branchLocationId,
  });

  return query;
}
