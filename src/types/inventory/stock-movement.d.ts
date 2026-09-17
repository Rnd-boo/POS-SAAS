export type StockMovement = {
  id: string;
  isPrevious?: boolean;
  qty_base: number;
  direction: "OUT" | "IN";
  reference_type: string;
  reference_id: string;
  balance: number;
  movement_date: string | Date;
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
