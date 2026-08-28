export type ProductStock = {
  id: number;
  on_hand: number;
  branch_location: {
    name: string;
  };
  products: {
    name: string;
    upc: string;
    status: boolean;
    categories: {
      name: string;
    };
    product_units: {
      id: number;
      units: {
        id: number;
        name: string;
      };
    }[];
  };
};
