export const applyFilterQuery = (
  query: any,
  filters: Record<string, string>,
) => {
  Object.entries(filters).forEach(([key, value]) => {
    if (!value) return;

    if (value.includes("_")) {
      const [from, to] = value.split("_");

      if (from && to) {
        query = query.gte(key, from).lte(key, to);
      }
    } else if (key.endsWith("name")) {
      query = query.ilike(key, `%${value}%`);
    } else {
      query = query.eq(key, value);
    }
  });

  return query;
};
