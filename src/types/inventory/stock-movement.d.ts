export type StockMovement = {
  id: number;
  qty_base: number;
  direction: "OUT" | "IN";
  reference_type: string;
  reference_id: string;
  movement_date: Date;
  branch_location: {
    name: string;
  };
  products: {
    name: string;
    upc: string;
    categories: {
      name: string;
    };
  };
  product_units: {
    units: {
      name: string;
    };
  };
};
