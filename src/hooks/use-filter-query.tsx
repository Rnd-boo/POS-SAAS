export const applyFilterQuery = (
  query: any,
  filters: Record<string, string>
) => {
  Object.entries(filters).forEach(([key, value]) => {
    if (!value) return;

    if (key === "name") {
      query = query.ilike(key, `%${value}%`);
    } else {
      query = query.eq(key, value);
    }
  });

  return query;
};
