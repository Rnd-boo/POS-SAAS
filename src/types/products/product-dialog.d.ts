export type UnitProduct = {
  id: string;
  products_id: string;
  units_id: string;
  products: {
    name: string;
    upc: string;
    categories: {
      name: string;
    }[];
  };
  units: {
    name: string;
  };
};
