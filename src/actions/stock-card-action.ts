// app/actions/stock-card.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import type { StockMovement } from "@/types/inventory/stock-movement";

export async function getStockCard(
  productUnitId: string,
  branchLocationId: string,
  startDate: string,
  endDate: string,
  page: number,
) {
  const supabase = await createClient();
  const pageStart = (page - 1) * 20;

  // Calculate previous balance (all movements before start_date)
  const { data: previousMovements, error: prevError } = await supabase
    .from("stock_movements")
    .select("direction, qty_base")
    .eq("product_units_id", productUnitId)
    .eq("branch_location_id", branchLocationId)
    .lt("movement_date", startDate);

  if (prevError) throw prevError;

  const previousBalance = previousMovements.reduce((sum, m) => {
    return sum + (m.direction === "IN" ? m.qty_base : -m.qty_base);
  }, 0);

  let precedingMovements: { direction: string; qty_base: number }[] = [];
  if (pageStart > 0) {
    const { data, error: precedingError } = await supabase
      .from("stock_movements")
      .select("direction, qty_base")
      .eq("product_units_id", productUnitId)
      .eq("branch_location_id", branchLocationId)
      .gte("movement_date", startDate)
      .lte("movement_date", endDate)
      .order("movement_date", { ascending: true })
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(0, pageStart - 1);

    if (precedingError) throw precedingError;
    precedingMovements = data;
  }

  const pageOpeningBalance = precedingMovements.reduce(
    (balance, movement) =>
      balance +
      (movement.direction === "IN" ? movement.qty_base : -movement.qty_base),
    previousBalance,
  );

  const {
    data: movements,
    error,
    count,
  } = await supabase
    .from("stock_movements")
    .select(
      "id, products!inner(name, upc), product_units(units(name)), branch_location(name), reference_type, qty_base, direction, reference_id, movement_date",
      {
        count: "exact",
      },
    )
    .eq("product_units_id", productUnitId)
    .eq("branch_location_id", branchLocationId)
    .gte("movement_date", startDate)
    .lte("movement_date", endDate)
    .order("movement_date", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .range(pageStart, pageStart + 20 - 1)
    .overrideTypes<StockMovement[]>();

  if (error) throw error;

  // Calculate running balance + total
  let runningBalance = pageOpeningBalance;
  let totalIn = 0;
  let totalOut = 0;

  const rows = movements.map((m) => {
    if (m.direction === "IN") {
      runningBalance += m.qty_base;
      totalIn += m.qty_base;
    } else {
      runningBalance -= m.qty_base;
      totalOut += m.qty_base;
    }
    return { ...m, balance: runningBalance };
  });

  if (page === 1) {
    rows.unshift({
      id: "previous",
      isPrevious: true,
      qty_base: 0,
      direction: "IN",
      reference_type: "Opening balance",
      reference_id: "",
      balance: previousBalance,
      movement_date: "",
      product_units: {
        units: {
          name: "",
        },
      },
      products: {
        name: "",
        upc: "",
        categories: {
          name: "",
        },
      },
      branch_location: {
        name: "",
      },
    });
  }

  return {
    previousBalance,
    rows,
    totalIn,
    totalOut,
    endingBalance: runningBalance,
    totalData: count ?? 0,
  };
}
